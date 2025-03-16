import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/tenant_settings/$tenantSettingId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { tenantSettingId } = Route.useParams();
  return <>tenant setting id: {tenantSettingId}</>;
}
