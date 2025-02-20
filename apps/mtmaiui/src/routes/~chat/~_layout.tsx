import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/chat/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello "/chat/_layout"!
      <Outlet />
    </div>
  );
}
