import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  tenantDefaultSettingMutation,
  tenantSettingsGetOptions,
} from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { Button } from "mtxuilib/ui/button";
import { useTenantId } from "../../../../hooks/useAuth";

export const Route = createLazyFileRoute("/tenant/settings/$tenantSettingId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { tenantSettingId } = Route.useParams();
  const tid = useTenantId();
  const query = useSuspenseQuery({
    ...tenantSettingsGetOptions({
      path: {
        tenant: tid,
        setting: tenantSettingId,
      },
    }),
  });

  const updateTenantSetting = useMutation({
    ...tenantDefaultSettingMutation({}),
  });
  return (
    <>
      tenant setting id: {tenantSettingId}
      <DebugValue data={query.data} />
      <div>
        <Button
          type="button"
          onClick={() => {
            updateTenantSetting.mutate({
              path: {
                tenant: tid,
                setting: tenantSettingId,
              },
            });
          }}
        >
          设为默认
        </Button>
      </div>
    </>
  );
}
