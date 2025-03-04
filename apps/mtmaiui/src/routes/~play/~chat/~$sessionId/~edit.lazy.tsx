import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/play/chat/$sessionId/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>chat session 编辑器</div>;
}
