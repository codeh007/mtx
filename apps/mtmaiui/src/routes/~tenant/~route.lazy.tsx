import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/tenant")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}
