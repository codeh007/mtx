"use client";

import { type AgentRunInput, FlowNames, workflowRunCreate } from "mtmaiapi";
import {
  ResourceEventType,
  type WorkflowEvent,
} from "mtmaiapi/mtmclient/mtmai/mtmpb/dispatcher_pb";
import { generateUUID } from "mtxuilib/lib/utils";
import type { AgTextMessage } from "../types/event";
import type { WorkbrenchState } from "./workbrench.store";
export async function submitMessages(
  set: (
    partial:
      | Partial<WorkbrenchState>
      | ((state: WorkbrenchState) => Partial<WorkbrenchState>),
  ) => void,
  get: () => WorkbrenchState,
) {
  const tenant = get().tenant;
  if (!tenant?.metadata?.id) {
    throw new Error("(handleSseGraphStream)tenant is required");
  }

  const messages = get().messages;
  let threadId = get().threadId;
  const resourceId = get().resourceId;
  const componentId = get().componentId;
  const content = messages[messages.length - 1].content;

  if (!threadId) {
    threadId = generateUUID();
    set({ threadId: threadId });
  }
  const response = await workflowRunCreate({
    path: {
      workflow: FlowNames.AG,
    },
    body: {
      input: {
        tenantId: tenant.metadata.id,
        content: content,
        sessionId: threadId,
        topic: "default",
        source: "web",
        resourceId: resourceId,
        componentId: componentId,
      } satisfies AgentRunInput,
      additionalMetadata: {
        sessionId: threadId,
      },
    },
  });

  if (response?.data) {
    const runId = response.data?.metadata?.id;
    set({ runId: runId });
    // pull stream event
    if (response.data?.metadata?.id) {
      const workflowRunId = response.data.metadata?.id;
      const result = await get().dispatcherClient.subscribeToWorkflowEvents({
        workflowRunId: workflowRunId,
      });
      for await (const event of result) {
        handleWorkflowRunEvent(event, get, set);
      }
    }
  }
}

const handleWorkflowRunEvent = (
  event: WorkflowEvent,
  get: () => WorkbrenchState,
  set: (
    partial:
      | Partial<WorkbrenchState>
      | ((state: WorkbrenchState) => Partial<WorkbrenchState>),
  ) => void,
) => {
  switch (event.eventType) {
    case ResourceEventType.STREAM:
      return onStreamEvent(event, get, set);
    case ResourceEventType.STARTED:
      console.log(`started run: ${event.workflowRunId}`);
      break;
    case ResourceEventType.COMPLETED:
      console.log(`completed run: ${event.workflowRunId}`);
      break;
    case ResourceEventType.FAILED:
      console.log(`failed run: ${event.workflowRunId}`);
      break;
    case ResourceEventType.CANCELLED:
      console.log(`cancelled run: ${event.workflowRunId}`);
      break;
    case ResourceEventType.TIMED_OUT:
      console.log(`timed out run: ${event.workflowRunId}`);
      break;
    default:
      console.error("⚠️ ⚠️ ⚠️ unknown workflow event type", event.eventType);
      break;
  }
};

const onStreamEvent = (
  event: WorkflowEvent,
  get: () => WorkbrenchState,
  set: (
    partial:
      | Partial<WorkbrenchState>
      | ((state: WorkbrenchState) => Partial<WorkbrenchState>),
  ) => void,
) => {
  // 相关 protobuf 文档: https://github.com/bufbuild/protobuf-es/blob/main/MANUAL.md
  const payload = JSON.parse(event.eventPayload);
  if (!payload) {
    console.error("⚠️ ⚠️ ⚠️ payload error", event);
    return;
  }
  console.log("payload", payload);
  if (payload.type === "ChatSessionStartEvent") {
    get().setThreadId(payload.threadId);
  } else if (payload.type === "UserInputRequestedEvent") {
    const newChatMessage = {
      role: "user",
      content: "UserInputRequestedEvent",
      topic: "default",
      source: "user",
      type: "text",
      metadata: {
        id: generateUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
    get().addMessage(newChatMessage);
  } else {
    console.log("AgTextMessage", payload);
    const agTextMessage = payload as AgTextMessage;
    if (agTextMessage.source === "user") {
      return;
    }
    const newChatMessage = {
      role: agTextMessage.source,
      content: agTextMessage.content,
      topic: "default",
      source: agTextMessage.source,
      type: agTextMessage.type,
      metadata: {
        id: generateUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
    get().addMessage(newChatMessage);
  }
};
