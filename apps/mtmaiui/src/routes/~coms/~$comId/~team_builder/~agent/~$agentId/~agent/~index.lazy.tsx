import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/coms/$comId/team_builder/agent/$agentId/agent/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div></div>;
}
