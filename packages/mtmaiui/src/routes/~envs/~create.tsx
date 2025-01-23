import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { postCreateMutation } from "mtmaiapi";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { TagsInput } from "mtxuilib/mt/inputs/TagsInput";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { toast } from "sonner";

import { Input } from "mtxuilib/ui/input";
import { z } from "zod";
import { useTenant } from "../../hooks/useAuth";

export const Route = createFileRoute("/envs/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const { siteId } = Route.useSearch();
  const tenant = useTenant();
  const createEnv = useMutation({
    ...postCreateMutation(),
    onSuccess: (data) => {
      toast.success("操作成功");
    },
    onError: (error) => {
      console.log("失败", error);
    },
  });

  const form = useZodForm({
    schema: z.any(),
  });
  return (
    <>
      <ZForm
        form={form}
        handleSubmit={(values) => {
          createEnv.mutate({
            path: {
              tenant: tenant!.metadata.id,
            },
            body: {
              ...values,
              siteId: siteId,
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
              <FormLabel>标题</FormLabel>
              <FormControl>
                <Input {...form.register("title")} placeholder="title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>tags</FormLabel>
              <FormControl>
                <TagsInput {...field} placeholder="tags" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => <Input {...field} placeholder="slug" />}
        />
      </ZForm>
    </>
  );
}
