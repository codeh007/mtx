import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dash/workflow-runs/$workflowRunId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dash/workflow-runs/$workflowRunId"!</div>;
}
