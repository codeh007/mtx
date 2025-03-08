import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { resourceUpsertMutation } from "mtmaiapi";
import { zMtResourceUpsert } from "mtmaiapi/gomtmapi/zod.gen";
import { EditFormToolbar } from "mtxuilib/mt/form/EditFormToolbar";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { useTenantId } from "../../../../hooks/useAuth";

export const Route = createLazyFileRoute("/resource/create/res/browser")({
  component: RouteComponent,
});

function RouteComponent() {
  const createBrowserMutation = useMutation({
    ...resourceUpsertMutation(),
  });
  const tid = useTenantId();
  const form = useZodForm({
    schema: zMtResourceUpsert,
    defaultValues: {},
  });
  return (
    <div>
      <h1>浏览器配置</h1>
      <div className="flex flex-col h-full w-full px-2">
        <ZForm
          form={form}
          handleSubmit={(values) => {
            createBrowserMutation.mutate({
              path: {
                tenant: tid,
              },
              body: {
                ...values,
              },
            });
          }}
          className="space-y-2"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <EditFormToolbar form={form} />
        </ZForm>
      </div>
    </div>
  );
}
