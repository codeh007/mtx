import { AIChatAgent } from "agents/ai-chat-agent";
import type { StreamTextOnFinishCallback } from "ai";
import { createDataStreamResponse, streamText } from "ai";
import { getDefaultModel } from "../model";
// import { model } from "../model";
// import type { Env } from "../server";

export class Chat extends AIChatAgent<Env> {
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  async onChatMessage(onFinish: StreamTextOnFinishCallback<{}>) {
    console.log("(agent chat) onChatMessage", this.env);

    const model = getDefaultModel(this.env);
    const dataStreamResponse = createDataStreamResponse({
      execute: async (dataStream) => {
        const result = streamText({
          model,
          messages: this.messages,

          onFinish,
        });

        result.mergeIntoDataStream(dataStream);
      },
    });

    return dataStreamResponse;
  }
}
