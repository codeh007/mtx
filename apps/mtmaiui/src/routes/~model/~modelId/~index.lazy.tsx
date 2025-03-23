import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/model/modelId/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1>编辑 model</h1>
    </div>
  );
}
