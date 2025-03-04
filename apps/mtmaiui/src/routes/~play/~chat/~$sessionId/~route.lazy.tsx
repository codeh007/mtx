import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import type { ChatMessage } from "mtmaiapi";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { useEffect } from "react";
import { DashContent } from "../../../../components/DashContent";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";
import { ChatClient } from "../chat/Chat.client";
import { useTeamStateQuery } from "../hooks/useTeamState";
export const Route = createLazyFileRoute("/play/chat/$sessionId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId } = Route.useParams();
  const setThreadId = useWorkbenchStore((x) => x.setThreadId);
  setThreadId(sessionId);

  const agStateQuery = useTeamStateQuery({ chatId: sessionId });
  const addMessage = useWorkbenchStore((x) => x.addMessage);
  const messages = useWorkbenchStore((x) => x.messages);
  useEffect(() => {
    // 从 team state 获取聊天信息
    if (messages.length > 0) {
      return;
    }
    if (agStateQuery.data) {
      if (agStateQuery.data.state) {
        const agent_states = agStateQuery.data.state.agent_states as any;
        for (const [key, value] of Object.entries(agent_states)) {
          // console.log("agent_state(KV)", key, value);
          if (key.startsWith("group_chat_manager/")) {
            console.log("group_chat_manager", key, value);

            const values2 = value as any;
            if (values2?.message_thread) {
              console.log("message_thread信息", values2.message_thread);
              const chat_messages = values2.message_thread as any[];
              for (const chat_message of chat_messages) {
                const newChatMessage = {
                  metadata: {
                    id: chat_message.id,
                    createdAt: chat_message.created_at,
                    updatedAt: chat_message.updated_at,
                  },
                  content: chat_message.content,
                  role: chat_message.source,
                } satisfies ChatMessage;
                addMessage(newChatMessage);
              }
            }
          }
        }
      }
    }
  }, [agStateQuery, addMessage, messages?.length]);

  return (
    <DashContent>
      <MtSuspenseBoundary>
        <div className="flex w-full h-full">
          <ChatClient />
          <MtSuspenseBoundary>
            <Outlet />
          </MtSuspenseBoundary>
        </div>
      </MtSuspenseBoundary>
    </DashContent>
  );
}
