import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/coms/$comId/team_builder/component/$nodeId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { nodeId } = Route.useParams();
  return (
    <div>
      <div>node id: {nodeId}</div>
    </div>
  );
}
