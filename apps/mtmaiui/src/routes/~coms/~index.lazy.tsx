import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/coms/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>组件首页</div>;
}
