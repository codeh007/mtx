import { isAIMessageChunk } from "@langchain/core/messages";
import type { Runnable } from "@langchain/core/runnables";
import { MemorySaver } from "@langchain/langgraph";
import { Hono } from "hono";
import type { Env } from "../../types";
const checkpointer = new MemorySaver();
const defaultProfile = "assisant";
export const agentApp = new Hono<{ Bindings: Env }>().get("/", async (c) => {
  return c.json({
    message: "hello agent (graph)",
  });
});

export async function* makeRunableStreamEvent(
  input: any,
  runable: Runnable,
  config: any,
): AsyncGenerator<any, void, unknown> {
  const eventStream = runable.streamEvents(input, {
    ...config,
    version: "v2",
  });

  for await (const { event, data } of eventStream) {
    console.log(event);
    if (event === "on_chat_model_stream" && isAIMessageChunk(data?.chunk)) {
      if (
        data.chunk.tool_call_chunks !== undefined &&
        data.chunk.tool_call_chunks?.length > 0
      ) {
        // yield data.chunk.tool_call_chunks;
      } else {
        if (data.chunk?.content) {
          yield `0:${JSON.stringify(data.chunk?.content)}\n`;
        }
      }
    }
  }
}
