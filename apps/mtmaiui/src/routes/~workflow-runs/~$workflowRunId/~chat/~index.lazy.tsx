import { createLazyFileRoute } from "@tanstack/react-router";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";
import { ChatClient } from "../../../~play/~chat/chat/Chat.client";

export const Route = createLazyFileRoute("/workflow-runs/$workflowRunId/chat/")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  const componentId = useWorkbenchStore((x) => x.componentId);
  return (
    <>
      componentId: {componentId}
      <ChatClient />
    </>
  );
}
