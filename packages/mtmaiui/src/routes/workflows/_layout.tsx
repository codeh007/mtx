import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/workflows/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-2">
      <div className="border-b">I'm a layout</div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
