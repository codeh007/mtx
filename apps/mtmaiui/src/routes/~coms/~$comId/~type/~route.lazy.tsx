import { Outlet, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/coms/$comId/type")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      team type viewer
      <Outlet />
    </>
  );
}
