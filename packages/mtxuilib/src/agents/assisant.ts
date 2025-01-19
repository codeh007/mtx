import type { RunnableConfig } from "@langchain/core/runnables";
import {
  Annotation,
  InMemoryStore,
  MemorySaver,
  MessagesAnnotation,
  NodeInterrupt,
  StateGraph,
} from "@langchain/langgraph";
import {
  type LlmConfig,
  type Tenant,
  type User,
  initMtiaiClient,
  llmGet,
  tenantMembershipsList,
  userGetCurrent,
} from "mtmaiapi";
import { getLlm } from "mtxuilib/llm/llm";
const inMemoryStore = new InMemoryStore();

const StateAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  nextRepresentative: Annotation<string>,
  refundAuthorized: Annotation<boolean>,
  input: Annotation<string>,
  someValue: Annotation<string>,
  someValue2: Annotation<string>,
  logs: Annotation<string[]>,
  tenant: Annotation<Tenant>,
  user: Annotation<User>,
  llmConfig: Annotation<LlmConfig>,
});

// 入口节点
const entryNode = async (
  state: typeof StateAnnotation.State,
  config?: RunnableConfig,
) => {
  // 1: 确保基础配置
  const gomtmApiUrl = config?.configurable?.gomtmApiUrl;
  console.log("进入入口节点, 开始初始化 gomtm api", gomtmApiUrl);
  initMtiaiClient(gomtmApiUrl);

  // const tenant = config?.configurable?.tenant;
  let user: User | undefined;
  try {
    user = (await userGetCurrent()).data;
  } catch (e) {
    console.warn("运行 入口节点获取用户信息失败");
    return {};
  }

  let tenant: Tenant | undefined;
  try {
    // const tenant = await tenantGetCurrent()
    const memberships = await tenantMembershipsList();
    // const findTenant = (tenantId: string) => {
    //   return memberships.data?.find((m) => m.tenant?.metadata.id === tenantId)
    //     ?.tenant;
    // };
    // const tenant = memberships.find(m => m.tenant?.metadata.id === user?.tenantId)?.tenant
  } catch (e) {
    console.warn("运行 入口节点获取租户息失败");
    return {};
  }

  if (!tenant) {
    console.log("缺少 tenant 信息");
    return {};
  }
  const llmConfig = await llmGet({
    path: {
      tenant: tenant.metadata.id,
      slug: "default",
    },
  });

  console.log("entryNode 节点完成");
  return {
    llmConfig,
    tenant,
    user,
  };
};

const initialSupport = async (state: typeof StateAnnotation.State) => {
  console.log("进入 initialSupport 节点");
  // (实验)序列化当前状态
  const serializedState = JSON.stringify(
    state,
    (key, value) => {
      if (value?._getType === "function") {
        // 如果是消息对象，保留关键信息
        return {
          role: value.role,
          content: value.content,
        };
      }
      return value;
    },
    2,
  );

  console.log("序列化后的状态:", serializedState);

  const llm = getLlm();
  const SYSTEM_TEMPLATE = `You are frontline support staff for LangCorp, a company that sells computers.
Be concise in your responses.
You can chat with customers and help them with basic questions, but if the customer is having a billing or technical problem,
do not try to answer the question directly or gather information.
Instead, immediately transfer them to the billing or technical team by asking the user to hold for a moment.
Otherwise, just respond conversationally.`;
  const supportResponse = await llm.invoke([
    { role: "system", content: SYSTEM_TEMPLATE },
    ...state.messages,
  ]);

  const CATEGORIZATION_SYSTEM_TEMPLATE = `You are an expert customer support routing system.
Your job is to detect whether a customer support representative is routing a user to a billing team or a technical team, or if they are just responding conversationally.`;
  const CATEGORIZATION_HUMAN_TEMPLATE = `The previous conversation is an interaction between a customer support representative and a user.
Extract whether the representative is routing the user to a billing or technical team, or whether they are just responding conversationally.
Respond with a JSON object containing a single key called "nextRepresentative" with one of the following values:

If they want to route the user to the billing team, respond only with the word "BILLING".
If they want to route the user to the technical team, respond only with the word "TECHNICAL".
Otherwise, respond only with the word "RESPOND".`;

  // const jschema = zodToJsonSchema(
  //   z.object({
  //     nextRepresentative: z.enum(["BILLING", "TECHNICAL", "RESPOND"]),
  //   }),
  // );
  const categorizationResponse = await llm.invoke(
    [
      {
        role: "system",
        content: CATEGORIZATION_SYSTEM_TEMPLATE,
      },
      ...state.messages,
      {
        role: "user",
        content: CATEGORIZATION_HUMAN_TEMPLATE,
      },
    ],
    // {
    //   response_format: {
    //     type: "json_object",
    //     // type: "json_schema",

    //     // type: "json_schema",
    //     // json_schema: {
    //     //   name:
    //     // },
    //   },
    // },
  );
  // Some chat models can return complex content, but Together will not
  // const categorizationOutput = JSON.parse(
  //   categorizationResponse.content as string,
  // );
  // Will append the response message to the current interaction state
  return {
    messages: [supportResponse],
    // nextRepresentative: categorizationOutput.nextRepresentative,
  };
};

const billingSupport = async (state: typeof StateAnnotation.State) => {
  const llm = getLlm();

  const SYSTEM_TEMPLATE = `You are an expert billing support specialist for LangCorp, a company that sells computers.
Help the user to the best of your ability, but be concise in your responses.
You have the ability to authorize refunds, which you can do by transferring the user to another agent who will collect the required information.
If you do, assume the other agent has all necessary information about the customer and their order.
You do not need to ask the user for more information.

Help the user to the best of your ability, but be concise in your responses.`;

  let trimmedHistory = state.messages;
  // Make the user's question the most recent message in the history.
  // This helps small models stay focused.
  if (trimmedHistory.at(-1)?._getType() === "ai") {
    trimmedHistory = trimmedHistory.slice(0, -1);
  }

  const billingRepResponse = await llm.invoke([
    {
      role: "system",
      content: SYSTEM_TEMPLATE,
    },
    ...trimmedHistory,
  ]);
  const CATEGORIZATION_SYSTEM_TEMPLATE =
    "Your job is to detect whether a billing support representative wants to refund the user.";
  const CATEGORIZATION_HUMAN_TEMPLATE = `The following text is a response from a customer support representative.
Extract whether they want to refund the user or not.
Respond with a JSON object containing a single key called "nextRepresentative" with one of the following values:

If they want to refund the user, respond only with the word "REFUND".
Otherwise, respond only with the word "RESPOND".

Here is the text:

<text>
${billingRepResponse.content}
</text>.`;
  const categorizationResponse = await llm.invoke(
    [
      {
        role: "system",
        content: CATEGORIZATION_SYSTEM_TEMPLATE,
      },
      {
        role: "user",
        content: CATEGORIZATION_HUMAN_TEMPLATE,
      },
    ],
    {
      response_format: {
        type: "json_object",
        // schema: zodToJsonSchema(
        //   z.object({
        //     nextRepresentative: z.enum(["REFUND", "RESPOND"]),
        //   }),
        // ),
      },
    },
  );
  const categorizationOutput = JSON.parse(
    categorizationResponse.content as string,
  );
  return {
    messages: billingRepResponse,
    nextRepresentative: categorizationOutput.nextRepresentative,
  };
};

const technicalSupport = async (state: typeof StateAnnotation.State) => {
  const llm = getLlm();

  const SYSTEM_TEMPLATE = `You are an expert at diagnosing technical computer issues. You work for a company called LangCorp that sells computers.
Help the user to the best of your ability, but be concise in your responses.`;

  let trimmedHistory = state.messages;
  // Make the user's question the most recent message in the history.
  // This helps small models stay focused.
  if (trimmedHistory?.at(-1)?._getType() === "ai") {
    trimmedHistory = trimmedHistory.slice(0, -1);
  }

  const response = await llm.invoke([
    {
      role: "system",
      content: SYSTEM_TEMPLATE,
    },
    ...trimmedHistory,
  ]);

  return {
    messages: response,
  };
};

const handleRefund = async (state: typeof StateAnnotation.State) => {
  if (!state.refundAuthorized) {
    //动态中断
    console.log("--- HUMAN AUTHORIZATION REQUIRED FOR REFUND ---");
    throw new NodeInterrupt("Human authorization required.");
  }
  return {
    messages: {
      role: "assistant",
      content: "Refund processed!",
    },
  };
};

const step2 = async (
  state: typeof StateAnnotation.State,
  config?: RunnableConfig,
) => {
  if (state.input?.length > 5) {
    //动态中断
    throw new NodeInterrupt(
      `Received input that is longer than 5 characters: ${state.input}`,
    );
  }
  console.log("---Step 2---");
  return state;
};

export function createAssistantGraph() {
  const checkpointer = new MemorySaver();
  const builder = new StateGraph(StateAnnotation)
    .addNode("entryNode", entryNode)
    .addNode("initial_support", initialSupport)
    // .addNode("billing_support", billingSupport)
    // .addNode("technical_support", technicalSupport)
    // .addNode("handle_refund", handleRefund)
    .addEdge("__start__", "entryNode");

  builder.addEdge("entryNode", "initial_support");
  // builder = builder.addConditionalEdges(
  //   "initial_support",
  //   async (state: typeof StateAnnotation.State) => {
  //     if (state.nextRepresentative.includes("BILLING")) {
  //       return "billing";
  //     }
  //     if (state.nextRepresentative.includes("TECHNICAL")) {
  //       return "technical";
  //     }
  //     return "conversational";
  //   },
  //   {
  //     billing: "billing_support",
  //     technical: "technical_support",
  //     conversational: "__end__",
  //   },
  // );

  // builder = builder
  //   .addEdge("technical_support", "__end__")
  //   .addConditionalEdges(
  //     "billing_support",
  //     async (state) => {
  //       if (state.nextRepresentative.includes("REFUND")) {
  //         return "refund";
  //       }
  //       return "__end__";
  //     },
  //     {
  //       refund: "handle_refund",
  //       __end__: "__end__",
  //     },
  //   )
  //   .addEdge("handle_refund", "__end__");

  return builder;
}
