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
import { Controller } from "react-hook-form";
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

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>content</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="content" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>type</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="type" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <EditFormToolbar form={form} />
          {/* {form.formState.errors && (
            <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
          )} */}
        </ZForm>
      </div>
    </div>
  );
}

const ControllerPlus = ({ control, transform, name, defaultValue }) => (
  <Controller
    defaultValue={defaultValue}
    control={control}
    name={name}
    render={({ field }) => (
      <input
        onChange={(e) => field.onChange(transform.output(e))}
        value={transform.input(field.value)}
      />
    )}
  />
);
