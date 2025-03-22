import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/model/new/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1>new model view</h1>
    </div>
  );
}
