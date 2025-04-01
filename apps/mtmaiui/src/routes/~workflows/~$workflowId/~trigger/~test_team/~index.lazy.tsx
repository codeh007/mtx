import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/workflows/$workflowId/trigger/test_team/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/workflows/$workflowId/trigger/test_team/"!</div>;
}
