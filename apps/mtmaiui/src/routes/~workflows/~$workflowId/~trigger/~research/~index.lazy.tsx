import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/workflows/$workflowId/trigger/research/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>research</div>;
}
