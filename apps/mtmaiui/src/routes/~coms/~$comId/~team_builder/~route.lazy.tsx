import { Outlet, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/coms/$comId/team_builder")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="px-4 space-y-2">
      <Outlet />
    </div>
  );
}
