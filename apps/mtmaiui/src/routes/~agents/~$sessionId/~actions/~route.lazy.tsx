import { createLazyFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/agents/$sessionId/actions")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}
