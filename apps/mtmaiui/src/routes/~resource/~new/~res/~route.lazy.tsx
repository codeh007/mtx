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
  FormMessage,
} from "mtxuilib/ui/form";
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

  // const match = useMatch({ from: "/resource/new/res/browser" });

  // const resourceType = useMemo(() => {
  //   return form.getValues("type");
  // }, [form]);
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
        {/* <pre>{JSON.stringify(match, null, 2)}</pre> */}
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
