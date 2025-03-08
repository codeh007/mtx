import { useMutation } from "@tanstack/react-query";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
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
export const Route = createLazyFileRoute("/resource/new/res")({
  component: RouteComponent,
});

function RouteComponent() {
  const tid = useTenantId();
  const resourceUpsert = useMutation({
    ...resourceUpsertMutation(),
  });
  const form = useZodForm({
    schema: zMtResourceUpsert,
    defaultValues: {},
  });
  return (
    <div className="flex flex-col h-full w-full px-2">
      <ZForm
        form={form}
        handleSubmit={(values) => {
          console.log(values);
          resourceUpsert.mutate({
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <input type="hidden" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <Outlet />
        <EditFormToolbar form={form} />
        {form.formState.errors && (
          <div className="text-red-500">
            {JSON.stringify(form.formState.errors, null, 2)}
          </div>
        )}
      </ZForm>
    </div>
  );
}
