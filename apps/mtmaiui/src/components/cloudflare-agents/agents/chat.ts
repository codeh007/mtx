import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { AIChatAgent } from "agents/ai-chat-agent";
import type { StreamTextOnFinishCallback } from "ai";
import { createDataStreamResponse, streamText } from "ai";

// import { model } from "../model";
// import type { Env } from "../server";

export class Chat extends AIChatAgent<Env> {
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  async onChatMessage(onFinish: StreamTextOnFinishCallback<{}>) {
    try {
      const googleModelClient = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      });
      console.log("googleModelClientkey", process.env);
      const model = googleModelClient("gemini-2.0-flash-exp", {});

      console.log("1111111111112222V2----------------");
      console.log("api key");
      console.log(`api key ${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`);
      // console.log("(agent chat) onChatMessage", this.env);
      console.log("1111111111112222");
      console.log(
        JSON.stringify(process.env.GOOGLE_GENERATIVE_AI_API_KEY, null, 2),
      );
      console.log("1111111111112224");
      // const model = getDefaultModel(this.env);
      console.log("1111111111112223");
      console.log("model", model);
      console.log(`mode provider, ${model.provider}`);
      console.log(`model json: ${JSON.stringify(model, null, 2)}`);

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
    } catch (e) {
      console.log(e);
    }
  }
}
