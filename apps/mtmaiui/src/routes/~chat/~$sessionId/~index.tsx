import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/chat/$sessionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <></>;
}
