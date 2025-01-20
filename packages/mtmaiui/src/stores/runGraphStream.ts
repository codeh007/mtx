"use client";

import { generateId } from "ai";
import type { AgentNodeRunRequest } from "mtmaiapi";
import type { AgentNodeState } from "./GraphContext";

const VERCEL_AI_EVENT_TYPES = {
  AI_REPLY: "0:",
  DATA: "2:",
  FINISH: "d:",
} as const;

export async function handleSseGraphStream(
  { ...props }: AgentNodeRunRequest,
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
  console.log("runGraphStream", { props, tenant, agentEndpointBase });
  // const endpointUrl = `${backendUrl}/api/v1/tenants/${tenant.metadata.id}/nodes/run`;
  const endpointUrl = `${agentEndpointBase}/api/chat`;
  const response = await fetch(endpointUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...props, isStream: true }),
    credentials: "include",
  });
  // stream 流式处理
  // 1: 格式转换
  // 2: 事件处理
  if (response?.body) {
    const reader = response.body.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const lines = new TextDecoder().decode(value).split("\n");
        for (const line of lines) {
          handleStreamLine(line, set, get);
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
    if (line.trim() === "") return;

    if (line.startsWith(VERCEL_AI_EVENT_TYPES.AI_REPLY)) {
      graphEventHandler(
        { type: "aiReply", data: JSON.parse(line.substring(2)) },
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
  const eventType = event.type;
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
              id: generateId(),
              createdAt: new Date().toISOString(),
              threadId: get().runId,
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
    case "newThread": {
      console.log("[TODO] newThread event", event);
      break;
    }
    default:
      console.debug("unknown event:", eventType);
      break;
  }
};
