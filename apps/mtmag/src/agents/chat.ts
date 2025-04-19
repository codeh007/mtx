import type { Schedule } from "agents";
import { AIChatAgent } from "agents/ai-chat-agent";
import type { StreamTextOnFinishCallback } from "ai";

import { createDataStreamResponse, streamText } from "ai";
// import type { Env } from "../hono_app/core/env";

import type { OutgoingMessage, ScheduledItem } from "../agent_state/shared";
import { getDefaultModel } from "../components/cloudflare-agents/model";
import { tools } from "./tools";

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
  //   onConnect(
  //     connection: Connection,
  //     ctx: ConnectionContext,
  //   ): void | Promise<void> {
  //     connection.send(JSON.stringify(this.getSchedules()));
  //   }

  //   async onMessage(connection: Connection, message: string): Promise<void> {
  //     console.log("(chat agent) on message", message);

  //     const event = JSON.parse(message) as IncomingMessage;
  //     const model = getDefaultModel(this.env);
  //     if (event.type === "schedule") {
  //       //步骤1: 通过llm 生成计划任务数据
  //       const result = await generateObject({
  //         model,
  //         mode: "json",
  //         schemaName: "task",
  //         schemaDescription: "A task to be scheduled",
  //         schema: unstable_scheduleSchema, // <- the shape of the object that the scheduler expects
  //         maxRetries: 5,
  //         prompt: `${unstable_getSchedulePrompt({
  //           date: new Date(),
  //         })}
  // Input to parse: "${event.input}"`,
  //       });
  //       const { when, description } = result.object;
  //       if (when.type === "no-schedule") {
  //         connection.send(
  //           JSON.stringify({
  //             type: "error",
  //             data: `No schedule provided for ${event.input}`,
  //           } satisfies OutgoingMessage),
  //         );
  //         return;
  //       }

  //       // 将任务安排放到队列
  //       const schedule = await this.schedule(
  //         when.type === "scheduled"
  //           ? when.date!
  //           : when.type === "delayed"
  //             ? when.delayInSeconds!
  //             : when.cron!,
  //         "onTask",
  //         description,
  //       );

  //       //通知客户端
  //       connection.send(
  //         JSON.stringify({
  //           type: "schedule",
  //           data: convertScheduleToScheduledItem(schedule),
  //         } satisfies OutgoingMessage),
  //       );
  //     } else if (event.type === "delete-schedule") {
  //       await this.cancelSchedule(event.id);
  //     }
  //   }

  async onChatMessage(onFinish: StreamTextOnFinishCallback<{}>) {
    console.log(`(chat on chat message), len: ${this.messages?.length}`);
    // try {
    const model = getDefaultModel(this.env);
    // console.log("chat with model", model.provider);
    const dataStreamResponse = createDataStreamResponse({
      execute: async (dataStream) => {
        const result = streamText({
          model,
          messages: this.messages,
          tools: { ...tools },
          onFinish,
        });

        result.mergeIntoDataStream(dataStream);
      },
    });

    return dataStreamResponse;
    // } catch (e) {
    //   console.log("未知错误111xxx", e);
    // }
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
