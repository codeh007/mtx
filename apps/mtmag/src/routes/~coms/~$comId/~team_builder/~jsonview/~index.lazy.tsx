import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/coms/$comId/team_builder/jsonview/")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  return <div>team build json view</div>;
}
