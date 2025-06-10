import { Outlet, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/trigger")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <h1>工作流触发</h1>
      <Outlet />
    </>
  );
}
