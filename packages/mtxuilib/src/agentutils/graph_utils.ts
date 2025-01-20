import { isAIMessageChunk } from "@langchain/core/messages";
import {
  InMemoryStore,
  type LangGraphRunnableConfig,
  MemorySaver,
} from "@langchain/langgraph";
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
export async function* runLanggraph(
  input,
  configurable: LangGraphRunnableConfig,
) {
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
  });
  // const store = new MemoryVectorStore(embeddings);
  const runable = buildCanvasGraph()
    .compile({
      checkpointer: memory,
    })
    .withConfig({ runName: "open_canvas" });

  let threadId = configurable.configurable.thread_id;
  if (!threadId) {
    threadId = generateUUID();
    yield `2:${JSON.stringify({ newThread: { threadId } })}\n`;
  }

  const config = {
    configurable: {
      ...configurable.configurable,
      thread_id: threadId,
      assistant_id: "default",
    },
  };
  const eventStream = await runable.streamEvents(input, {
    configurable: config.configurable,
    store: inMemoryStore,
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
    try {
      yield `d:"[DONE]"\n`;
      // 保存 state
      // 提示: 关于状态的问题:
      //     虽然 langgraphjs 提供了 store  memory 等功能,但是实现的方式,可以理解为一个 api 端点.
      //     查看他们的范例, 他们使用store\ memory 都是在节点内部调用,因此, 可以自己实现一个基于数据库的方式的api 实现 store 的功能.
      //     而不是依赖 langgraphjs 自带的 store memory, 毕竟最终还是需要基于数据库的持久化的.
    } catch (finalError) {
      console.error("[runLanggraph] Error in finally block:", finalError);
    }
  }
}
