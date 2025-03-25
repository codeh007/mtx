import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/tenant/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1>tenants 管理(TODO)</h1>
    </div>
  );
}
