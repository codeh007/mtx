import type { Schedule } from "agents";
import type { Connection, ConnectionContext } from "agents";
import { AIChatAgent } from "agents/ai-chat-agent";
import { type StreamTextOnFinishCallback, createDataStreamResponse, streamText } from "ai";
import type { RootAgentState } from "../agent_state/root_agent_state";
import type { IncomingMessage, OutgoingMessage, ScheduledItem } from "../agent_state/shared";
import { getDefaultModel } from "../components/cloudflare-agents/model";
// import { createDataStreamResponse, streamText } from "ai";
import { tools } from "./tools";
import { processToolCalls } from "./utils";

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
    console.log("chat onStart");
    // const session = await getAuthUser(this.ctx);
    // console.log("session", session);
  }
  onConnect(connection: Connection, ctx: ConnectionContext) {
    // console.log("chat onConnect");
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
    const dataStreamResponse = createDataStreamResponse({
      execute: async (dataStream) => {
        // Utility function to handle tools that require human confirmation
        // Checks for confirmation in last message and then runs associated tool
        const processedMessages = await processToolCalls(
          {
            messages: this.messages,
            dataStream,
            tools,
          },
          {
            // type-safe object for tools without an execute function
            getWeatherInformation: async ({ city }) => {
              const conditions = ["sunny", "cloudy", "rainy", "snowy"];
              return `The weather in ${city} is ${
                conditions[Math.floor(Math.random() * conditions.length)]
              }.`;
            },
          },
        );

        const result = streamText({
          // model: openai("gpt-4o"),
          model,
          messages: processedMessages,
          tools,
          onFinish,
        });

        result.mergeIntoDataStream(dataStream);
      },
    });

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
}
