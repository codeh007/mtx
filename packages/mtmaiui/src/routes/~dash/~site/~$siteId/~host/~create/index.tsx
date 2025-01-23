import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { siteHostCreateMutation } from "mtmaiapi";
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
import { useTenant } from "../../../../../../hooks/useAuth";

export const Route = createFileRoute("/dash/site/$siteId/host/create/")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = useParams({ strict: false });
  const form = useZodForm({});
  const tenant = useTenant();

  const siteHostCreate = useMutation({
    ...siteHostCreateMutation(),
  });
  const handleSubmit = (values) => {
    console.log("submit form", values);
    siteHostCreate.mutate({
      path: {
        tenant: tenant!.metadata.id,
      },
      body: {
        ...values,
        siteId: params.siteId,
      },
    });
  };
  return (
    <ZForm form={form} handleSubmit={handleSubmit}>
      <div className="p-8">
        create site host
        <FormField
          control={form.control}
          name="host"
          render={({ field }) => (
            <FormItem>
              <FormLabel>input</FormLabel>
              <FormControl>
                <Input placeholder="域名" {...field} />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <EditFormToolbar form={form} />
      </div>
    </ZForm>
  );
}
