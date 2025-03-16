import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/tenant_settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div>Tenant Settings</div>
    </div>
  );
}
