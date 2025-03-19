import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/workflows/$workflowId/trigger/ag/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>ag flow view</div>;
}
