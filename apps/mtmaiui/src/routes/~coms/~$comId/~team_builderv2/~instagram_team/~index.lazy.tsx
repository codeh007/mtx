import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/coms/$comId/team_builderv2/instagram_team/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/coms/$comId/team_builderv2/instagram_team/"!</div>;
}
