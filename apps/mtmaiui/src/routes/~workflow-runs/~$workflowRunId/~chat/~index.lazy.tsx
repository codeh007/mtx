import { createLazyFileRoute } from "@tanstack/react-router";
import { ChatClient } from "../../../~play/~chat/chat/Chat.client";

export const Route = createLazyFileRoute("/workflow-runs/$workflowRunId/chat/")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  // const componentId = useWorkbenchStore((x) => x.componentId);
  // const sessionId = useWorkbenchStore((x) => x.sessionId);
  return (
    <>
      <ChatClient />
    </>
  );
}
