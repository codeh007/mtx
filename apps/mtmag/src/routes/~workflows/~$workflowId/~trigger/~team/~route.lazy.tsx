import { Outlet, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/workflows/$workflowId/trigger/team")(
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
