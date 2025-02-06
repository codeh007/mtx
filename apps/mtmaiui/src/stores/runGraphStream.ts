"use client";

import { generateId } from "ai";
import { type AgentNodeRunInput, agentNodeRun } from "mtmaiapi";
import type { AgentNodeState } from "./GraphContext";

const VERCEL_AI_EVENT_TYPES = {
  AI_REPLY: "0:",
  DATA: "2:",
  FINISH: "d:",
} as const;

export async function handleSseGraphStream(
  { ...props }: AgentNodeRunInput,
  set: (
    partial:
      | Partial<AgentNodeState>
      | ((state: AgentNodeState) => Partial<AgentNodeState>),
  ) => void,
  get: () => AgentNodeState,
) {
  const agentEndpointBase = get().agentEndpointBase;
  const tenant = get().tenant;
  if (!tenant?.metadata?.id) {
    throw new Error("(runGraphStream)tenant is required");
  }

  const messages = get().messages;
  console.log("runGraphStream", { props, tenant, agentEndpointBase, messages });

  const response = await agentNodeRun({
    path: {
      tenant: tenant.metadata.id,
    },
    body: {
      ...props,
      messages,
      runner: get().runner,
    },
    headers: {
      Accept: "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
    parseAs: "stream",
  });
  // const response = await chatChat({
  //   path: {
  //     tenant: tenant.metadata.id,
  //   },
  //   body: {
  //     ...props,
  //     messages,
  //     runner: get().runner,
  //   },
  //   headers: {
  //     Accept: "text/event-stream",
  //     "Cache-Control": "no-cache",
  //     Connection: "keep-alive",
  //   },
  //   parseAs: "stream",
  // });

  // stream 流式处理
  if (response?.data) {
    const reader = response.response.body?.getReader();
    if (!reader) {
      throw new Error("Stream reader not found");
    }
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.trim()) {
            handleStreamLine(line, set, get);
          }
        }
      }
    } catch (error) {
      console.error("Error processing stream:", error);
      throw error;
    } finally {
      reader.releaseLock();
    }
  }
}

// 处理单行数据
const handleStreamLine = (
  line: string,
  set: (
    partial:
      | Partial<AgentNodeState>
      | ((state: AgentNodeState) => Partial<AgentNodeState>),
  ) => void,
  get: () => AgentNodeState,
) => {
  try {
    if (line.trim()?.length === 0) return;

    if (line.startsWith(VERCEL_AI_EVENT_TYPES.AI_REPLY)) {
      console.log("AI_REPLY", line);
      graphEventHandler(
        { event: "aiReply", data: JSON.parse(line.substring(2)) },
        set,
        get,
      );
    } else if (line.startsWith(VERCEL_AI_EVENT_TYPES.DATA)) {
      const lineData = JSON.parse(line.substring(2));
      graphEventHandler(lineData, set, get);
    } else if (line.startsWith(VERCEL_AI_EVENT_TYPES.FINISH)) {
      const lineData = JSON.parse(line.substring(2));
      // 处理完成消息，如果需要的话
    } else {
      console.warn("Unhandled event type:", line);
    }
  } catch (error) {
    console.error("Error processing stream line:", error, { line });
  }
};

// 最终的事件处理
const graphEventHandler = async (
  event: Record<string, any>,
  set: (
    partial:
      | Partial<AgentNodeState>
      | ((state: AgentNodeState) => Partial<AgentNodeState>),
  ) => void,
  get: () => AgentNodeState,
) => {
  const eventType = event.event || event.type;
  switch (eventType) {
    case "aiReply": {
      const content = event.data;
      const lastMessage = get().messages[get().messages.length - 1];
      if (lastMessage.role === "user") {
        set({
          messages: [
            ...get().messages,
            {
              role: "assistant",
              content,
              metadata: {
                id: generateId(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            },
          ],
        });
      }
      if (lastMessage?.role === "assistant") {
        lastMessage.content = lastMessage.content.concat(content);
        const messagesWithoutLast = get().messages.slice(0, -1);
        set({
          messages: [...messagesWithoutLast, lastMessage],
        });
      }
      break;
    }
    case "TextMessage": {
      console.log("[Event] TextMessage", event);
      set({
        messages: [
          ...get().messages,
          {
            role: event.source || "assistant",
            content: event.content,
            id: generateId(),
          },
        ],
      });
      break;
    }
    case "ToolCallRequestEvent": {
      console.log("[Event] ToolCallRequestEvent", event);
      break;
    }
    case "newThread": {
      console.log("[TODO] newThread event", event);
      break;
    }
    case "generateArtifact": {
      console.log("[Event] generateArtifact", event, JSON.parse(event.data));
      set({
        artifact: JSON.parse(event.data),
      });
      break;
    }
    default:
      console.debug("unknown event:", eventType);
      break;
  }
};
