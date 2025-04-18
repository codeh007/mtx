import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
export const Route = createLazyFileRoute("/session/mcp_agent")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}
