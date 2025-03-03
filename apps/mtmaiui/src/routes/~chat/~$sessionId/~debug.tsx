import { createFileRoute } from "@tanstack/react-router";
import { useWorkbenchStore } from "../../../stores/workbrench.store";
import { MtWorkbench } from "../MtWorkbench";

export const Route = createFileRoute("/chat/$sessionId/debug")({
  component: RouteComponent,
});

function RouteComponent() {
  const chatStarted = useWorkbenchStore((x) => x.chatStarted);
  const isStreaming = useWorkbenchStore((x) => x.isStreaming);
  return (
    <>
      <MtWorkbench chatStarted={chatStarted} isStreaming={isStreaming} />
    </>
  );
}
