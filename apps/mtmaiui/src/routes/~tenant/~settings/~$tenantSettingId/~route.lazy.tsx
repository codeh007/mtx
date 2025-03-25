import { useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { tenantSettingsGetOptions } from "mtmaiapi";
import { ZForm, ZFormToolbar, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { z } from "zod";
import { useTenantId } from "../../../../hooks/useAuth";

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
  const form = useZodForm({
    schema: z.any(),
    defaultValues: tenantSettingQuery.data,
  });
  const handleSubmit = form.handleSubmit((data) => {
    console.log(data);
  });
  return (
    <ZForm form={form} handleSubmit={handleSubmit}>
      <Outlet />
      <ZFormToolbar form={form} />
    </ZForm>
  );
}
