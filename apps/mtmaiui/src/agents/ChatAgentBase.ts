import type { Connection, Schedule } from "agents";
import { AIChatAgent } from "agents/ai-chat-agent";
import type { StreamTextOnFinishCallback, ToolSet } from "ai";
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
  }

  notifySchedule(schedule: Schedule<string>) {
    this.broadcast(
      JSON.stringify({
        type: "schedule",
        data: convertScheduleToScheduledItem(schedule),
      }),
    );
  }
}
