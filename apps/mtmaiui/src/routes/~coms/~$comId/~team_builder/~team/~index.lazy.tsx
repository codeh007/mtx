import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/coms/$comId/team_builder/team/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1>team view</h1>
    </div>
  );
}
