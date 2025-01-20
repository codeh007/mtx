import { isAIMessageChunk } from "@langchain/core/messages";
import { InMemoryStore, MemorySaver } from "@langchain/langgraph";
import { OpenAIEmbeddings } from "@langchain/openai";
// import { MemoryVectorStore } from "langchain/vectorstores/memory";
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
  // const store = new MemoryVectorStore(embeddings);
  const runable = buildCanvasGraph()
    .compile({
      checkpointer: memory,
    })
    .withConfig({ runName: "open_canvas" });

  let threadId = configurable.thread_id;
  if (!threadId) {
    threadId = generateUUID();
    yield `2:${JSON.stringify({ newThread: { threadId } })}\n`;
  }
  const eventStream = await runable.streamEvents(input, {
    ...{
      configurable: {
        ...configurable,
        thread_id: threadId,
        assistant_id: "default",
      },
      store: inMemoryStore,
    },
    version: "v2",
  });

  try {
    for await (const e of eventStream) {
      if (e.event !== "on_chat_model_stream") {
        console.log(
          `[stream]: ${e.run_id},${e.name},${e.event},\n===========\n${JSON.stringify(
            e,
            null,
            2,
          )}\n===========\n`,
        );
      }

      const langgraph_node = e.metadata.langgraph_node;
      if (e.event === "on_chain_start") {
        // console.log("on_chain_start", data);
      }
      if (
        e.event === "on_chat_model_stream" &&
        isAIMessageChunk(e.data?.chunk)
      ) {
        if (
          e.data.chunk.tool_call_chunks !== undefined &&
          e.data.chunk.tool_call_chunks?.length > 0
        ) {
          // yield data.chunk.tool_call_chunks;
        } else {
          if (e.data.chunk?.content) {
            if (langgraph_node === "generateArtifact") {
              // yield `0:${JSON.stringify(e.data.chunk.content)}\n`;
            } else if (langgraph_node === "generateFollowup") {
              yield `0:${JSON.stringify(e.data.chunk.content)}\n`;
            } else if (langgraph_node === "replyToGeneralInput") {
              yield `0:${JSON.stringify(e.data.chunk.content)}\n`;
            } else {
              // yield `0:${JSON.stringify(data.chunk.content)}\n`;
            }
          }
        }
      }
      // else if (e.event === "on_chat_model_end") {
      //   yield `d:"[DONE]"\n`;
      // }
    }
  } catch (error: any) {
    console.error("[runLanggraph] Error:", error);
    yield `3:${JSON.stringify({ error: error.message })}\n`;
  } finally {
    yield `d:"[DONE]"\n`;
  }
}
