import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/workflow-runs/$workflowRunId/chat/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <>聊天交互记录</>;
}
