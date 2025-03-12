import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/coms/$comId/$comType")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1>component view by type</h1>
    </div>
  );
}
