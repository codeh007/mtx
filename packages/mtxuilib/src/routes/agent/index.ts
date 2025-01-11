import { isAIMessageChunk } from "@langchain/core/messages";
import type { Runnable } from "@langchain/core/runnables";
import { MemorySaver } from "@langchain/langgraph";
import { Hono } from "hono";
// import { createAssistantGraph } from "../../../../mtxlib/src/agents/assisant";
// import { buildCanvasGraph } from "../../agents/open-canvas";
// import { createSimulationGraph } from "../../../../mtxlib/src/agents/simulationGraph";
// import { TestAgent } from "../../agents/testagent";
import { generateUUID } from "../../lib/s-utils";
import { StreamingResponse, makeStream } from "../../lib/sse/sse";
import type { Env } from "../../types";
// import { blogGraphRoute } from "./blogGraph";
// import { reactAgentDemoRoute } from "./demo/react.ts--";
import { mtmaiAgentRoute } from "./mtmai";
import { testAgentApp } from "./testagent";
const checkpointer = new MemorySaver();
const defaultProfile = "assisant";
export const agentApp = new Hono<{ Bindings: Env }>()
  .get("/", async (c) => {
    return c.json({
      message: "hello agent (graph)",
    });
  })
  .all("/run", async (c) => handlerRunAgent(c.req.raw));
agentApp.route("/testagent", testAgentApp).route("/mtmai", mtmaiAgentRoute);
// .route("/blog", blogGraphRoute);
// .route("/demo/react", reactAgentDemoRoute);

export async function handlerRunAgent(req: Request) {
  let input: any = {};
  if (req.method === "POST") {
    input = await req.json();
  }

  let profile = "chat";
  if (input.profile) {
    profile = input.profile;
  }

  console.log("input", input);

  const config = {
    configurable: {
      thread_id: input.threadId || generateUUID(),
    },
  };

  const StreamMode = "lc-raw";
  if (StreamMode === "lc-raw") {
    return new StreamingResponse(
      makeStream(makeRunableStreamEventLcRaw(input, config)),
    );
  }
  // vercel ai stream protocol
  return new StreamingResponse(
    makeStream(makeRunableStreamEvent(input, config)),
  );
}

export async function* makeRunableStreamEvent(
  input: any,
  config: any,
): AsyncGenerator<any, void, unknown> {
  const runable = await getRunableByNodeName(input.profile || defaultProfile);
  const eventStream = runable.streamEvents(input, {
    ...config,
    version: "v2",
  });

  for await (const { event, data } of eventStream) {
    console.log(event);
    if (event === "on_chat_model_stream" && isAIMessageChunk(data?.chunk)) {
      if (
        data.chunk.tool_call_chunks !== undefined &&
        data.chunk.tool_call_chunks?.length > 0
      ) {
        // yield data.chunk.tool_call_chunks;
      } else {
        if (data.chunk?.content) {
          yield `0:${JSON.stringify(data.chunk?.content)}\n`;
        }
      }
    }
  }
}
export async function* makeRunableStreamEventLcRaw(
  input: any,
  config: any,
): AsyncGenerator<any, void, unknown> {
  const runable = await getRunableByNodeName(input.profile || defaultProfile);
  const eventStream = runable.streamEvents(input, {
    ...config,
    version: "v2",
  });

  for await (const chunk of eventStream) {
    // console.log(chunk);
    if (chunk) {
      try {
        const str = JSON.stringify(chunk);
        yield `${str}\n`;
      } catch (e) {
        yield `errpr ${e}`;
      }
    }
  }
  console.log("graph 运行完毕");
}

async function getRunableByNodeName(name: string): Promise<Runnable> {
  if (name === "simulationGraph") {
    // const wf = createSimulationGraph();
    // const graph = wf.compile({ checkpointer });
    // //@ts-ignore
    // return graph;
  }
  if (name === "assisant") {
    // const wf = createAssistantGraph();
    // const graph = wf.compile({ checkpointer });
    // //@ts-ignore
    // return graph;
  }
  if (name === "test") {
    // const r = new TestAgent(new AgentCtx());
    // return r.runnable();
  }
  // if (name === "canvas") {
  //   const graph = buildCanvasGraph()
  //     .compile()
  //     .withConfig({ runName: "canvas" });
  //   return graph;
  // }
  throw new Error(`Graph ${name} not found`);
}
