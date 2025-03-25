import { createLazyFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/sys")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
