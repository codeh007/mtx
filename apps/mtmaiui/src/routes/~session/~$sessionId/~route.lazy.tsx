import { useQuery } from "@tanstack/react-query";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { chatMessagesListOptions } from "mtmaiapi";
import { useEffect } from "react";
import { useTenantId } from "../../../hooks/useAuth";
import { useWorkbenchStore } from "../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/session/$sessionId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId } = Route.useParams();
  const { comId } = Route.useSearch();
  const setThreadId = useWorkbenchStore((x) => x.setThreadId);
  const setComponentId = useWorkbenchStore((x) => x.setComponentId);
  const tid = useTenantId();
  const chatMessagesQuery = useQuery({
    ...chatMessagesListOptions({
      path: {
        tenant: tid!,
        chat: sessionId,
      },
    }),
  });
  const loadChatMessageList = useWorkbenchStore((x) => x.loadChatMessageList);
  useEffect(() => {
    // if (chatMessagesQuery.data) {
    loadChatMessageList(chatMessagesQuery.data);
    // }
  }, [chatMessagesQuery.data, loadChatMessageList]);
  useEffect(() => {
    if (sessionId) {
      setThreadId(sessionId);
    }
  }, [sessionId, setThreadId]);
  useEffect(() => {
    if (comId) {
      setComponentId(comId);
    }
  }, [comId, setComponentId]);
  return (
    <>
      <Outlet />
    </>
  );
}
