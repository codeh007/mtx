import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { resourceGetOptions, resourceUpsertMutation } from "mtmaiapi";
import { zMtResourceUpsert } from "mtmaiapi/gomtmapi/zod.gen";
import { EditFormToolbar } from "mtxuilib/mt/form/EditFormToolbar";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { Button } from "mtxuilib/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { useTenantId } from "../../../../hooks/useAuth";
import { PlatformAccountFields } from "../../fields/PlatformAccountFields";

export const Route = createLazyFileRoute("/resource/$resId/platform_account/")({
  component: RouteComponent,
});

function RouteComponent() {
  const tid = useTenantId();
  const { resId } = Route.useParams();
  const resourceUpsert = useMutation({
    ...resourceUpsertMutation(),
  });

  const platformAccountQuery = useSuspenseQuery({
    ...resourceGetOptions({
      path: {
        tenant: tid,
        resource: resId,
      },
    }),
  });
  const form = useZodForm({
    schema: zMtResourceUpsert,
    defaultValues: {
      ...platformAccountQuery.data,
      type: "platform_account",
    },
  });
  return (
    <div className="px-2">
      <h1>社交媒体账号</h1>
      <div>
        <Button>测试运行</Button>
      </div>
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

        <PlatformAccountFields />
        <EditFormToolbar form={form} />
        {form.formState.errors && (
          <pre className="text-red-500">
            {JSON.stringify(form.formState.errors, null, 2)}
          </pre>
        )}
      </ZForm>
    </div>
  );
}
