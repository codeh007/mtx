import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/session/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>对话首页</div>;
}
