import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/play/chat/$sessionId/result")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>显示团队运行的最终结果 (TeamResult)</div>;
}
