import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/coms/$comId/team_builder/agent/$agentId/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { agentId } = Route.useParams();
  return (
    <div>
      <div>agent id : {agentId}</div>
    </div>
  );
}
