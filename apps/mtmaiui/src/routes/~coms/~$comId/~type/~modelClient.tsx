import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/coms/$comId/type/modelClient")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1>ModelClient</h1>
    </div>
  );
}
