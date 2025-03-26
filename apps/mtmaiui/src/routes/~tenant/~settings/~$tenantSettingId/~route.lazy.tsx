import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import {
  tenantSettingsGetOptions,
  tenantSettingsUpsertMutation,
} from "mtmaiapi";
import { zTenantSettingUpsert } from "mtmaiapi/gomtmapi/zod.gen";
import { ZForm, ZFormToolbar, useZodFormV2 } from "mtxuilib/mt/form/ZodForm";
import { useTenantId } from "../../../../hooks/useAuth";
import { TenantSettingHeader } from "./header";

export const Route = createLazyFileRoute("/tenant/settings/$tenantSettingId")({
  component: RouteComponent,
});

function RouteComponent() {
  const tid = useTenantId();
  const { tenantSettingId } = Route.useParams();

  const tenantSettingQuery = useSuspenseQuery({
    ...tenantSettingsGetOptions({
      path: {
        tenant: tid,
        setting: tenantSettingId,
      },
    }),
  });

  const updateTenantSetting = useMutation({
    ...tenantSettingsUpsertMutation({}),
  });

  const form = useZodFormV2({
    schema: zTenantSettingUpsert,
    defaultValues: {
      ...tenantSettingQuery.data,
    },
    handleSubmit: (data) => {
      updateTenantSetting.mutate({
        path: {
          tenant: tid,
          setting: tenantSettingId,
        },
        body: { ...data },
      });
    },
    toastValidateError: true,
  });
  return (
    <>
      <TenantSettingHeader />
      <ZForm {...form} className="px-2">
        <Outlet />
      </ZForm>
      <ZFormToolbar {...form} />
    </>
  );
}
