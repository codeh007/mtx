"use client";

// import { type Any, anyPack, anyIs } from "@bufbuild/protobuf/wkt";
import { create, createRegistry } from "@bufbuild/protobuf";
import type { GenMessage } from "@bufbuild/protobuf/codegenv1";
import {
  type AgentRunInput,
  EventTypes,
  FlowNames,
  workflowRunCreate,
} from "mtmaiapi";
import { CloudEventSchema } from "mtmaiapi/mtmclient/mtmai/mtmpb/cloudevent_pb";
import {
  ResourceEventType,
  type WorkflowEvent,
} from "mtmaiapi/mtmclient/mtmai/mtmpb/dispatcher_pb";
import { ChatSessionStartEventSchema } from "mtmaiapi/mtmclient/mtmai/mtmpb/events_pb";
import { generateUUID } from "mtxuilib/lib/utils";
import type { AgTextMessage } from "../types/event";
import type { WorkbrenchState } from "./workbrench.store";
const registry = createRegistry(CloudEventSchema, ChatSessionStartEventSchema);
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
  const teamId = get().teamId;
  let threadId = get().threadId;
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
        teamId: teamId,
        sessionId: threadId,
      } satisfies AgentRunInput,
      additionalMetadata: {
        sessionId: threadId,
      },
    },
  });

  if (response?.data) {
    // console.log("new run ", response.data);
    const runId = response.data?.metadata?.id;
    set({ runId: runId });
    // await handleStreamResponse(response.response, (line) =>
    //   handleStreamLine(line, set, get),
    // );
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

  // const eventClient = get().eventClient;
  // await eventClient.push({
  //   key: "ag:run",
  //   payload: JSON.stringify({
  //     content: content,
  //     tenantId: get().tenant.metadata.id,
  //   } satisfies AgentRunInput),
  // });
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

  if (isMatchPbSchema(payload, ChatSessionStartEventSchema)) {
    const chatSessionStart = create(ChatSessionStartEventSchema, payload);
    console.log("chatSessionStart", chatSessionStart);
    get().setThreadId(chatSessionStart.threadId);
  } else {
    const agTextMessage = payload as AgTextMessage;
    if (agTextMessage.source === "user") {
      return;
    }
    const newChatMessage = {
      role: agTextMessage.source,
      content: agTextMessage.content,
      metadata: {
        id: generateUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
    get().addMessage(newChatMessage);
  }
};

function isMatchPbSchema(
  payload: Record<string, any>,
  schema: GenMessage<any>,
) {
  if (
    payload["@type"] === schema.typeName ||
    payload["@typeName"] === schema.typeName
  ) {
    return true;
  }
  // console.log("not match", payload, schema.typeName);
  return false;
}
// 最终的事件处理
const graphEventHandler = async (
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  event: Record<string, any>,
  set: (
    partial:
      | Partial<WorkbrenchState>
      | ((state: WorkbrenchState) => Partial<WorkbrenchState>),
  ) => void,
  get: () => WorkbrenchState,
) => {
  const eventType = (event.event || event.type) as EventTypes;
  switch (eventType) {
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
              id: generateUUID(),
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
                id: generateUUID(),
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
    // case EventTypes.WORKFLOW_RUN_START:
    //   console.log("[Event] startWorkflowRun", event);
    //   pullEvent(get().tenant?.metadata?.id, event.data.id, set, get);
    //   break;
    default:
      console.debug("unknown event:", eventType);
      break;
  }
};
