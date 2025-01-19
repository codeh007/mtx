import { isAIMessageChunk } from "@langchain/core/messages";
import type { Runnable } from "@langchain/core/runnables";
import { generateUUID } from "../utils";
export async function* runableSseStream(runable: Runnable, input: any) {
  const threadId = generateUUID();
  const config2 = { configurable: { thread_id: threadId } };
  const eventStream = await runable.streamEvents(input, {
    ...config2,
    version: "v2",
  });

  for await (const { event, data } of eventStream) {
    if (event === "on_chat_model_stream" && isAIMessageChunk(data?.chunk)) {
      if (
        data.chunk.tool_call_chunks !== undefined &&
        data.chunk.tool_call_chunks?.length > 0
      ) {
        // yield data.chunk.tool_call_chunks;
      } else {
        if (data.chunk?.content) {
          // yield emitText(data.chunk.content as string);
          yield "0:sseStream123";
        }
      }
    }
  }
}
