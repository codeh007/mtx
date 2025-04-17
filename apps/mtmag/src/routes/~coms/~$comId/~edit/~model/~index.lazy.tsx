import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/coms/$comId/edit/model/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1>edit model</h1>
    </div>
  );
}
