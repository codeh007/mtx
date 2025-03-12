import { Outlet, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/coms/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      新建组件
      <Outlet />
    </div>
  );
}
