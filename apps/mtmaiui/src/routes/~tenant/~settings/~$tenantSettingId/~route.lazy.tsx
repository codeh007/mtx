import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  tenantSettingsGetOptions,
  tenantSettingsUpsertMutation,
} from "mtmaiapi";
import {
  ZForm,
  ZFormField,
  ZFormToolbar,
  useZodForm,
} from "mtxuilib/mt/form/ZodForm";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { z } from "zod";
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

  const form = useZodForm({
    schema: z.any(),
    defaultValues: tenantSettingQuery.data,
  });
  const handleSubmit = (data) => {
    updateTenantSetting.mutate({
      path: {
        tenant: tid,
        setting: tenantSettingId,
      },
      body: { ...data },
    });
  };
  return (
    <>
      <TenantSettingHeader />
      <div className="flex flex-col gap-2 px-2">
        <ZForm form={form} handleSubmit={handleSubmit}>
          {/* <Outlet /> */}
          <ZFormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>标题</FormLabel>
                <FormControl>
                  <Input placeholder="标题222" {...field} />
                </FormControl>
                {/* <FormDescription></FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
        </ZForm>
        <ZFormToolbar form={form} />
      </div>
    </>
  );
}
