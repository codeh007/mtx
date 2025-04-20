import type { Schedule } from "agents";
import type { Connection, ConnectionContext } from "agents";
import { AIChatAgent } from "agents/ai-chat-agent";
import { type StreamTextOnFinishCallback, createDataStreamResponse, streamText } from "ai";
import type { RootAgentState } from "../agent_state/root_agent_state";
import type { IncomingMessage, OutgoingMessage, ScheduledItem } from "../agent_state/shared";
import { getDefaultModel } from "../components/cloudflare-agents/model";
// import { createDataStreamResponse, streamText } from "ai";

function convertScheduleToScheduledItem(schedule: Schedule): ScheduledItem {
  return {
    id: schedule.id,
    trigger:
      schedule.type === "delayed"
        ? `in ${schedule.delayInSeconds} seconds`
        : schedule.type === "cron"
          ? `at ${schedule.cron}`
          : `at ${new Date(schedule.time * 1000).toISOString()}`,
    nextTrigger: new Date(schedule.time * 1000).toISOString(),
    description: schedule.payload,
    type: schedule.type,
  };
}

export class Chat extends AIChatAgent<Env, RootAgentState> {
  initialState = {
    counter: 0,
    text: "root ag text",
    color: "#3B82F6",
    mainViewType: "chat",
    chatHistoryIds: [],
    mcpServers: {},
    mcpTools: [],
    mcpPrompts: [],
    mcpResources: [],
  } satisfies RootAgentState;

  onStart(): void | Promise<void> {
    // console.log("chat onStart");
  }
  onConnect(connection: Connection, ctx: ConnectionContext) {
    this.broadcast(
      JSON.stringify({
        type: "connected",
        data: { message: "(chat agent)Hello, world! connected" },
      } satisfies OutgoingMessage),
    );
  }

  async onMessage(connection: Connection, message: string): Promise<void> {
    const event = JSON.parse(message) as IncomingMessage;

    if (event.type === "schedule") {
    } else if (event.type === "delete-schedule") {
      await this.cancelSchedule(event.id);
    } else if (event.type === "demo_run_2") {
      this.onDemoRun2(event.data);
    } else {
      // console.log("root ag unknown message", event);
      super.onMessage(connection, message);
    }
  }

  async onChatMessage(onFinish: StreamTextOnFinishCallback<{}>) {
    const model = getDefaultModel(this.env);
    const ctx = this.ctx;
    const env = this.env;

    // cloudflare agents 的 streamText 的实现
    // const dataStreamResponse = createDataStreamResponse({
    //   execute: async (dataStream) => {
    //     const lastestMessage = this.messages?.[this.messages.length - 1];
    //     lastestMessage.content;
    //     const result = streamText({
    //       model,
    //       messages: this.messages,
    //       // tools: { ...tools },
    //       onFinish,
    //       onError: (error) => {
    //         console.log("onStreamText error", error);
    //       },
    //     });

    //     result.mergeIntoDataStream(dataStream);
    //   },
    // });

    // return dataStreamResponse;

    const helloStream = async () => {
      const a = streamText({
        model,
        messages: this.messages,
      });
      for await (const chunk of a.textStream) {
        // dataStream.write(`0:${chunk}\n`);
        // await new Promise((resolve) => setTimeout(resolve, 300));
      }
      return a;
    };

    const helloStream2 = async function* () {
      yield "hello";
      yield "world";
      yield "test";
    };

    //例子2: 处理工具调用, 当需要人工输入时, 执行工具
    const dataStreamResponse = createDataStreamResponse({
      execute: async (dataStream) => {
        // Step 1: Extract user goal with forced tool call
        const result1 = streamText({
          model,
          system: "Extract the user goal from the conversation.",
          messages: this.messages,
          toolChoice: "required", // force the model to call a tool
          onFinish,
          tools: {
            // extractGoal: tool({
            //   parameters: z.object({ goal: z.string() }),
            //   execute: async ({ goal }) => goal, // no-op extract tool
            // }),
          },
        });
        // // Forward the initial result to the client without the finish event
        result1.mergeIntoDataStream(dataStream, {
          // experimental_sendFinish: false, // omit the finish event
        });
      },
      onError: (error) => {
        console.log("onStreamText error", error);
        return "error on streamText344444";
      },
    });
    //例子3:

    return dataStreamResponse;
  }
  async onTask(payload: unknown, schedule: Schedule<string>) {
    // 提示: 当到时间运行新任务时, 会先进入这个函数.
    //      这个函数, 应该实际运行 任务载荷,
    //      建议的方式:
    //        1: 通过 api 运行远程任务.
    //        2:
    //
    console.log("on Task", payload, schedule);

    // 广播任务信息, 这样,所有在同一个 房间的客户端都可以接收到信息,从而可以自主运行实际的任务.
    this.broadcast(
      JSON.stringify({
        type: "run-schedule",
        data: convertScheduleToScheduledItem(schedule),
      } satisfies OutgoingMessage),
    );
  }

  async onDemoRun2(data: unknown) {
    console.log("onDemoRun2", data);
  }
}
