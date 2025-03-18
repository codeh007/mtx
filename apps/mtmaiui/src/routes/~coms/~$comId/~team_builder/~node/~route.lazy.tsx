import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/coms/$comId/team_builder/node")({
  component: RouteComponent,
});

function RouteComponent() {
  return <>node</>;
}
