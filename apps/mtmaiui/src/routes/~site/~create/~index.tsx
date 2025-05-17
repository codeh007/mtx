import { useMutation } from "@tanstack/react-query";
import type { Site } from "mtmaiapi";

import { createFileRoute } from "@tanstack/react-router";
import { ZForm, ZFormToolbar, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";

export const Route = createFileRoute("/site/create/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SiteCreateView />;
}

interface SiteCreateViewProps {
  onCancel?: () => void;
  onSuccess?: (data: Site) => void;
}
export const SiteCreateView = (props: SiteCreateViewProps) => {
  const { onCancel, onSuccess } = props;
  // const tenant = useTenant();
  const form = useZodForm({
    defaultValues: {},
  });

  const createSiteMutation = useMutation({
    // ...siteCreateMutation(),
    mutationFn: async (data) => {
      const res = await fetch("/api/sites", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: (data) => {
      onSuccess?.(data);
    },
  });
  const handleSubmit = async (data) => {
    createSiteMutation.mutate({
      title: data.title,
      host: data.host,
    });
  };
  return (
    <ZForm form={form} handleSubmit={handleSubmit} className="flex flex-col space-y-2 px-2">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>title</FormLabel>
            <FormControl>
              <Input placeholder="title" {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="host"
        render={({ field }) => <Input placeholder="host" {...field} />}
      />
      <ZFormToolbar form={form} onCancel={onCancel} />
    </ZForm>
  );
};
