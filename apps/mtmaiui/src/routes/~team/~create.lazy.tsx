import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { tenantSeedMutation } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import { useTenant } from "../../hooks/useAuth";

export const Route = createLazyFileRoute("/team/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const tenant = useTenant();

  const seedTenant = useMutation({
    ...tenantSeedMutation({}),
  });
  return (
    <div>
      <h1>创建默认团队</h1>
      <input type="text" placeholder="Team Name" />
      <Button
        onClick={() => {
          seedTenant.mutate({
            path: {
              tenant: tenant!.metadata.id,
            },
            body: {
              tenantId: tenant!.metadata.id,
            },
          });
        }}
      >
        立即创建
      </Button>
    </div>
  );
}
