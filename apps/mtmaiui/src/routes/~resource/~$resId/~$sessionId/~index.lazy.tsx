import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";
import { ChatClient } from "../../../~play/~chat/chat/Chat.client";

export const Route = createLazyFileRoute("/resource/$resId/$sessionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId, resId } = Route.useParams();

  const setThreadId = useWorkbenchStore((x) => x.setThreadId);
  const threadId = useWorkbenchStore((x) => x.threadId);
  const resourceId = useWorkbenchStore((x) => x.resourceId);
  const setResourceId = useWorkbenchStore((x) => x.setResourceId);
  useEffect(() => {
    setThreadId(sessionId);
  }, [sessionId, setThreadId]);

  useEffect(() => {
    setResourceId(resId);
  }, [resId, setResourceId]);
  return (
    <>
      threadId:{threadId}
      resourceId:{resourceId}
      <ChatClient />
    </>
  );
}
