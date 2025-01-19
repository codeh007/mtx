import { isAIMessageChunk } from "@langchain/core/messages";
import { createAssistantGraph } from "../agents/assisant";
import { generateUUID } from "../lib/s-utils";
import { StreamingResponse, makeStream } from "../llm/sse";

export async function* runLanggraph(input: any) {
  const builder = createAssistantGraph();
  const runable = builder.compile();
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
          yield data.chunk.content;
        }
      }
    }
  }
}

export function newGraphSseResponse(graphName: string, input, config) {
  const stream = runLanggraph(input);
  return new StreamingResponse(makeStream(stream));
}
