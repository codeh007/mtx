import { isAIMessageChunk } from "@langchain/core/messages";
import { InMemoryStore, MemorySaver } from "@langchain/langgraph";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { buildCanvasGraph } from "../agents/open-canvas";
import { generateUUID } from "../lib/s-utils";
import { StreamingResponse, makeStream } from "../llm/sse";

const memory = new MemorySaver();
const inMemoryStore = new InMemoryStore();
export function newGraphSseResponse(graphName: string, input, configurable) {
  // TODO: 增加 zod schema 验证输入格式
  const stream = runLanggraph(input, configurable);
  return new StreamingResponse(makeStream(stream));
}
export async function* runLanggraph(input, configurable) {
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
  });
  const store = new MemoryVectorStore(embeddings);
  const runable = buildCanvasGraph()
    .compile({
      checkpointer: memory,
    })
    .withConfig({ runName: "open_canvas" });

  const eventStream = await runable.streamEvents(input, {
    ...{
      configurable: {
        ...configurable,
        thread_id: configurable.thread_id || generateUUID(),
        assistant_id:"default",
      },
      store: inMemoryStore,
    },
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
