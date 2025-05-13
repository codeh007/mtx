import type { Connection, Schedule } from "agents";
import { unstable_callable as callable } from "agents";
import { AIChatAgent } from "agents/ai-chat-agent";
import type { StreamTextOnFinishCallback, ToolSet } from "ai";
import { MtmaiuiConfig } from "../lib/config";
import { convertScheduleToScheduledItem } from "./utils";

export class ChatAgentBase<Env = unknown, State = unknown> extends AIChatAgent<Env, State> {
  onMessage(connection: Connection, message: string): Promise<void> {
    return super.onMessage(connection, message);
  }
  async onChatMessage(onFinish: StreamTextOnFinishCallback<ToolSet>) {
    const lastestMessage = this.messages?.[this.messages.length - 1];
    const userInput = lastestMessage?.content;
    this.log("userInput", userInput);
    if (userInput?.startsWith("/test/base")) {
      this.log("test/base");
      return;
    }
    return super.onChatMessage(onFinish);
  }

  log(...messages: unknown[]) {
    const message = messages.map((msg) => String(msg)).join(" ");
    this.broadcast(
      JSON.stringify({
        type: "log",
        data: {
          level: "info",
          message,
        },
      }),
    );
  }

  handleException(error: unknown) {
    console.error("Error calling coder agent", error);
    this.log(`(handleException): ${error}`);
    this.setState({
      ...this.state,
      error: error,
    });
  }

  notifySchedule(schedule: Schedule<string>, connection: Connection | undefined = undefined) {
    const message = JSON.stringify({
      type: "schedule",
      data: convertScheduleToScheduledItem(schedule),
    });
    if (connection) {
      connection.send(message);
    } else {
      this.broadcast(message);
    }
  }

  // 通过广播通知所有 参与者, 现在立即执行任务
  notifyRunSchedule(schedule: Schedule<string>) {
    const message = JSON.stringify({
      type: "runSchedule",
      data: convertScheduleToScheduledItem(schedule),
    });
    this.broadcast(message);
  }

  notifyError(error: unknown, connection: Connection | undefined = undefined) {
    const message = JSON.stringify({
      type: "error",
      data: error,
    });
    if (connection) {
      connection.send(message);
    } else {
      this.broadcast(message);
    }
  }
  //=========================================================================================================
  // 发送消息到 MQ
  //=========================================================================================================
  @callable()
  async pushTask(taskType: string, payload: any) {
    const res = await fetch(`${MtmaiuiConfig.apiEndpoint}/api/mq/${taskType}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  }
}
