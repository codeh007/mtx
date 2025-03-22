import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/coms/$comId/team_builder/agent/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { comId } = Route.useParams();
  return <></>;
}
