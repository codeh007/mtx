import { createClient, createConfig } from "@hey-api/client-fetch";
import { isAIMessageChunk } from "@langchain/core/messages";
import type { Runnable } from "@langchain/core/runnables";
import { InMemoryStore, MemorySaver } from "@langchain/langgraph";
import { OpenAIEmbeddings } from "@langchain/openai";
import {
  type AgentRunInput,
  type CanvasGraphParams,
  mtmaiWorkerConfig,
  userGetCurrent,
} from "mtmaiapi/gomtmapi";
import { buildCanvasGraph } from "../agents/open-canvas";
import { buildStormGraph } from "../agents/storm";
import { generateUUID } from "../lib/sslib";
import { StreamingResponse, makeStream } from "../llm/sse";
import type { MtmRunnableConfig } from "./runableconfig";

const memorySaver = new MemorySaver();
const inMemoryStore = new InMemoryStore();
export function newGraphSseResponse(
  agentName: string,
  input: CanvasGraphParams,
  configurable,
) {
  // TODO: 增加 zod schema 验证输入格式
  const stream = runLanggraph(agentName, input, configurable);
  return new StreamingResponse(makeStream(stream));
}
export async function* runLanggraph(
  agentName: string,
  input: AgentRunInput["params"],
  config: MtmRunnableConfig,
) {
  if (!config.configurable.ctx.accessToken) {
    throw new Error("accessToken is required");
  }

  const mtmclient = createClient(createConfig());
  mtmclient.setConfig({
    baseUrl: config.configurable.backendUrl,
    headers: {
      Authorization: `Bearer ${config.configurable.ctx.accessToken}`,
    },
  });
  config.configurable.mtmclient = mtmclient;

  // 获取基本配置信息
  const mtmaiConfig = await mtmaiWorkerConfig({ client: mtmclient });
  // console.log("mtmaiConfig", mtmaiConfig.data);
  // 获取用户基本信息
  if (!config.configurable.ctx.userId) {
    const user = await userGetCurrent({ client: mtmclient });
    if (!user) {
      throw new Error("user is required");
    }
    config.configurable.ctx.userId = user.data.metadata.id;
  }

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
  });
  // const store = new MemoryVectorStore(embeddings);
  let runable: Runnable;

  let threadId = config.configurable?.thread_id;
  if (!threadId) {
    threadId = generateUUID();
    yield `2:${JSON.stringify({ newThread: { threadId } })}\n`;
  }
  const graphConfig = {
    configurable: {
      ...config.configurable,
      thread_id: threadId,
      assistant_id: "default",
      mtmaiConfig: mtmaiConfig.data,
      mtmclient: mtmclient,
      store: inMemoryStore,
    },
    runName: agentName,
  } satisfies MtmRunnableConfig;

  if (agentName === "postiz") {
  } else if (agentName === "storm") {
    const graph = buildStormGraph()
      .compile({
        checkpointer: memorySaver,
      })
      .withConfig(graphConfig);
    runable = graph;
  } else {
    const graph = buildCanvasGraph()
      .compile({
        checkpointer: memorySaver,
      })
      .withConfig(graphConfig);

    graph.updateState(graphConfig, {
      values: {
        ...input,
        thread_id: threadId,
        messages: input.messages || [],
      },
    });
    runable = graph;
  }

  const eventStream = await runable.streamEvents(input, {
    configurable: {
      ...graphConfig.configurable,
    },
    version: "v2",
  });

  try {
    for await (const e of eventStream) {
      const langgraph_node = e.metadata.langgraph_node;
      if (e.event !== "on_chat_model_stream") {
        // console.log(
        //   `[stream]: ${e.run_id},${e.name},${e.event},\n===========\n${JSON.stringify(
        //     e,
        //     null,
        //     2,
        //   )}\n===========\n`,
        // );
        // console.log(`[stream]: ${langgraph_node},${e.name},${e.event}`);
      }

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
        } else {
          if (e.data.chunk?.content) {
            if (langgraph_node === "generateArtifact") {
              // yield EmitDataEvent("generateArtifact", e.data.chunk.content);
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
      if (langgraph_node === "generateArtifact") {
        if (e.data?.chunk?.content) {
          // TODO: 不应该通过事件传递完整数据,而是 eventName 和 itemId 类似的形式, 客户端通过 itemId 自己去拉取完整数据
          yield EmitDataEvent("generateArtifact", e.data.chunk.content);
        }
      }
    }
  } catch (error) {
    console.error("[runLanggraph] Error:", error);
    yield `3:${JSON.stringify({ error: (error as Error).message })}\n`;
  } finally {
    yield `d:"[DONE]"\n`;
  }
}

const EmitDataEvent = (eventName: string, eventData: any) => {
  return `2:${JSON.stringify({ event: eventName, data: eventData })}`;
};
