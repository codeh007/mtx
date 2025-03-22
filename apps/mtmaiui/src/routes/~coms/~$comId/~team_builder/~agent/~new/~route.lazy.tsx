import { Outlet, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/coms/$comId/team_builder/agent/new")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}
