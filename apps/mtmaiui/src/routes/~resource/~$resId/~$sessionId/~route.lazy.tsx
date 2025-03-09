import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";
import { ChatClient } from "../../../~play/~chat/chat/Chat.client";

export const Route = createLazyFileRoute("/resource/$resId/$sessionId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId } = Route.useParams();

  const setThreadId = useWorkbenchStore((x) => x.setThreadId);
  useEffect(() => {
    setThreadId(sessionId);
  }, [sessionId, setThreadId]);
  return (
    <>
      <ChatClient />
      <Outlet />
    </>
  );
}
