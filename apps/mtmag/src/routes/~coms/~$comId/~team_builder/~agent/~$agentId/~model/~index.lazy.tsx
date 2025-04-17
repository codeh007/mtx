import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/coms/$comId/team_builder/agent/$agentId/model/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>model editor</div>;
}
