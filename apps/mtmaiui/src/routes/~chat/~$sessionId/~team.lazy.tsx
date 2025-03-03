import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/chat/$sessionId/team")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className="bg-blug-200 p-2">team view</div>;
}
