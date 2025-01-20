import { isAIMessageChunk } from "@langchain/core/messages";
import { buildCanvasGraph } from "../agents/open-canvas";
// import { createAssistantGraph } from "../agents/assisant.ts--";
import { generateUUID } from "../lib/s-utils";
import { StreamingResponse, makeStream } from "../llm/sse";

export function newGraphSseResponse(graphName: string, input, configurable) {
  // TODO: 增加 zod schema 验证输入格式
  const stream = runLanggraph(input, configurable);
  return new StreamingResponse(makeStream(stream));
}
export async function* runLanggraph(input, configurable) {
  // const builder = createAssistantGraph();

  const runable = buildCanvasGraph()
  .compile()
  .withConfig({ runName: "open_canvas" });

  // const runable = builder.compile();
  const eventStream = await runable.streamEvents(input, {
    ...{
      configurable: {
        ...configurable,
        thread_id: configurable.thread_id || generateUUID(),
      },
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
