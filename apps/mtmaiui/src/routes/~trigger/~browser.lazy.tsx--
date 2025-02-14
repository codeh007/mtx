"use client";
import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { Input } from "mtxuilib/ui/input";

import { FlowNames, workflowRunCreateMutation } from "mtmaiapi";
import { EditFormToolbar } from "mtxuilib/mt/form/EditFormToolbar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { toast } from "mtxuilib/ui/use-toast";
import { z } from "zod";

export const Route = createLazyFileRoute("/trigger/browser")({
  component: RouteComponent,
});

function RouteComponent() {
  //   const tenant = useTenant();
  const navigate = useNavigate({ from: "/trigger/browser" });
  const triggerWorkflowMutation = useMutation({
    ...workflowRunCreateMutation(),
    onSuccess: (data) => {
      toast({
        title: "操作成功",
        description: "触发 workflow 成功",
      });
      navigate({ to: ".." });
      // window.history.back();
    },
    onError: (error) => {
      toast({
        title: "操作失败",
        description: error.errors.join(","),
      });
    },
    onMutate: () => {
      toast({
        title: "处理中",
        description: "触发 workflow 中",
      });
    },
  });

  const formSchema = z.object({
    input: z.string().optional(),
  });

  const form = useZodForm({
    schema: formSchema,
    defaultValues: {
      input: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    triggerWorkflowMutation.mutate({
      path: {
        // tenant: tenant!.metadata.id,
        workflow: FlowNames.BROWSER,
      },
      body: {
        // workflow: FlowNames.BROWSER,
        input: values,
      },
    });
  };

  return (
    <>
      <h1>FlowBrowser</h1>
      <ZForm className="" handleSubmit={handleSubmit} form={form}>
        <FormField
          control={form.control}
          name="input"
          render={({ field }) => (
            <FormItem>
              <FormLabel>标题</FormLabel>
              <FormControl>
                <Input placeholder="输入" {...field} />
              </FormControl>
              <FormDescription>
                输入要搜索的标题，例如：“如何使用React”
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </ZForm>
      <EditFormToolbar form={form} />
    </>
  );
}
