import type { Schedule } from "agents";
import { AIChatAgent } from "agents/ai-chat-agent";
import type { StreamTextOnFinishCallback } from "ai";

import { createDataStreamResponse, streamText } from "ai";

import type { OutgoingMessage, ScheduledItem } from "../agent_state/shared";
import { getDefaultModel } from "../components/cloudflare-agents/model";

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
export class Chat extends AIChatAgent<Env> {
  async onChatMessage(onFinish: StreamTextOnFinishCallback<{}>) {
    console.log(`(chat on chat message), len: ${this.messages?.length}`);
    const model = getDefaultModel(this.env);

    const ctx = this.ctx;
    const env = this.env;
    const dataStreamResponse = createDataStreamResponse({
      execute: async (dataStream) => {
        const result = streamText({
          model,
          messages: this.messages,
          // tools: { ...tools },
          onFinish,
          onError: (error) => {
            console.log("onStreamText error", error);
          },
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
