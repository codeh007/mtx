"use client";

import { generateId } from "ai";
import {
  type AgentRunInput,
  EventTypes,
  FlowNames,
  agentStream,
  workflowRunCreate,
} from "mtmaiapi";
import type { AgentNodeState } from "./GraphContext";

const VERCEL_AI_EVENT_TYPES = {
  AI_REPLY: "0:",
  DATA: "2:",
  FINISH: "d:",
} as const;

// 处理流式响应
async function handleStreamResponse(
  response: Response,
  lineHandler: (line: string) => void,
) {
  const reader = response.body?.getReader();
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
          lineHandler(line);
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
async function pullEvent(
  tenantId: string,
  workflowRunId: string,
  set: (
    partial:
      | Partial<AgentNodeState>
      | ((state: AgentNodeState) => Partial<AgentNodeState>),
  ) => void,
  get: () => AgentNodeState,
) {
  console.log("pullEvent", { tenantId, workflowRunId });
  const response = await agentStream({
    path: {
      tenant: tenantId,
      stream: workflowRunId,
    },
    headers: {
      Accept: "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
    parseAs: "stream",
  });

  if (response?.data) {
    await handleStreamResponse(response.response, (line) =>
      handleStreamLine(line, set, get),
    );
  }
}

export async function handleSseGraphStream(
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
  const teamId = get().teamId;
  const threadId = get().threadId;
  console.log("runGraphStream", {
    tenant,
    threadId,
    agentEndpointBase,
    messages,
    teamId,
  });

  const task = "test";
  const response = await workflowRunCreate({
    path: {
      workflow: FlowNames.AG,
    },
    body: {
      input: {
        tenantId: tenant.metadata.id,
        task: task,
        teamId: teamId,
        threadId: threadId || "",
      } satisfies AgentRunInput,
    },
    headers: {
      Accept: "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
    parseAs: "stream",
  });

  if (response?.data) {
    await handleStreamResponse(response.response, (line) =>
      handleStreamLine(line, set, get),
    );
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
    if (line.startsWith(VERCEL_AI_EVENT_TYPES.DATA)) {
      const lineData = JSON.parse(line.substring(2));
      graphEventHandler(lineData, set, get);
    } else if (line.startsWith(VERCEL_AI_EVENT_TYPES.FINISH)) {
      // const lineData = JSON.parse(line.substring(2));
      // 处理完成消息，如果需要的话
    } else {
      graphEventHandler(JSON.parse(line), set, get);
    }
  } catch (error) {
    console.error("Error processing stream line:", error, { line });
  }
};

// 最终的事件处理
const graphEventHandler = async (
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  event: Record<string, any>,
  set: (
    partial:
      | Partial<AgentNodeState>
      | ((state: AgentNodeState) => Partial<AgentNodeState>),
  ) => void,
  get: () => AgentNodeState,
) => {
  const eventType = (event.event || event.type) as EventTypes;
  switch (eventType) {
    // case EventTypes.ASSISANT_REPLY: {
    //   console.log("[Event] ASSISANT_REPLY", event);
    //   const content = event.data;
    //   if (!content) return;
    //   const lastMessage = get().messages[get().messages.length - 1];
    //   if (lastMessage.role === "user") {
    //     set({
    //       messages: [
    //         ...get().messages,
    //         {
    //           role: "assistant",
    //           content,
    //           metadata: {
    //             id: generateId(),
    //             createdAt: new Date().toISOString(),
    //             updatedAt: new Date().toISOString(),
    //           },
    //         },
    //       ],
    //     });
    //   }
    //   if (lastMessage?.role === "assistant") {
    //     lastMessage.content = lastMessage?.content?.concat(content);
    //     if (lastMessage.content) {
    //       const messagesWithoutLast = get().messages.slice(0, -1);
    //       set({
    //         messages: [...messagesWithoutLast, lastMessage],
    //       });
    //     }
    //   }
    //   break;
    // }
    case EventTypes.TEXT_MESSAGE: {
      console.log("[Event] TextMessage", event);

      if (event.source === "user") {
        break;
      }
      set({
        messages: [
          ...get().messages,
          {
            // role: event.source || "assistant",
            role: "assistant", // 暂时全部设置为 assistant, 原因是 assisant ui ,仅支持 user + assisant
            content: event.content,
            metadata: {
              id: generateId(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
        ],
      });
      break;
    }
    case EventTypes.MODEL_CLIENT_STREAMING_CHUNK_EVENT: {
      // agent 流式输出
      if (!event?.content?.length) {
        break;
      }
      const lastMessage = get().messages[get().messages.length - 1];
      console.log("[Event] ModelClientStreamingChunkEvent", {
        event,
        lastMessage,
      });
      if (lastMessage.role !== "assistant") {
        set({
          messages: [
            ...get().messages,

            {
              role: "assistant",
              content: event.content,
              metadata: {
                id: generateId(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            },
          ],
        });
      } else {
        set({
          messages: [
            ...get().messages,
            {
              ...lastMessage,
              content: lastMessage.content?.concat(event.content),
            },
          ],
        });
      }
      break;
    }
    case EventTypes.WORKFLOW_RUN_START:
      console.log("[Event] startWorkflowRun", event);
      pullEvent(get().tenant?.metadata?.id, event.data.id, set, get);
      break;
    default:
      console.debug("unknown event:", eventType);
      break;
  }
};
