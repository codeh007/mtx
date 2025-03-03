import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useWorkbenchStore } from "../../../stores/workbrench.store";
import { AgStateView2 } from "../../~ag_state/components/AgStateView";

export const Route = createLazyFileRoute("/chat/$sessionId/debug")({
  component: RouteComponent,
});

function RouteComponent() {
  const chatStarted = useWorkbenchStore((x) => x.chatStarted);
  const isStreaming = useWorkbenchStore((x) => x.isStreaming);
  const chatSessionId = useWorkbenchStore((x) => x.threadId);

  useEffect(() => {
    console.log("chatStarted", chatStarted);
    console.log("isStreaming", isStreaming);
  }, [chatStarted, isStreaming]);
  return <>{chatSessionId && <AgStateView2 chatId={chatSessionId} />}</>;
}
