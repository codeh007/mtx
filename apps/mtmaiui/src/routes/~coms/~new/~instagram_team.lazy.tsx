import { createLazyFileRoute } from "@tanstack/react-router";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

export const Route = createLazyFileRoute("/coms/new/instagram_team")({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useFormContext();

  const componentSchema = z.object({
    name: z.string(),
    description: z.string(),
  });
  return (
    <div>
      <h1>instagram 团队配置</h1>
      <div className="flex flex-col h-full w-full px-2">
        {/* <ZForm
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
        > */}
        {/* <FormField
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
        /> */}

        <FormField
          control={form.control}
          name="component.title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>标题</FormLabel>
              <FormControl>
                <Input {...field} placeholder="标题" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
