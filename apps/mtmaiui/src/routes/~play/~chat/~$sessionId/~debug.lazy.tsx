import { createLazyFileRoute } from "@tanstack/react-router";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";
export const Route = createLazyFileRoute("/play/chat/$sessionId/debug")({
  component: RouteComponent,
});

function RouteComponent() {
  const chatStarted = useWorkbenchStore((x) => x.chatStarted);
  const isStreaming = useWorkbenchStore((x) => x.isStreaming);
  // const chatSessionId = useWorkbenchStore((x) => x.threadId);

  return <>debug view</>;
}
