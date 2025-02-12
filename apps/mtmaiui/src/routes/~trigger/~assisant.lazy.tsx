"use client";
import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { FlowNames, workflowRunCreateMutation } from "mtmaiapi";
import { zAgentRunInput } from "mtmaiapi/gomtmapi/zod.gen";
import { EditFormToolbar } from "mtxuilib/mt/form/EditFormToolbar";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { toast } from "mtxuilib/ui/use-toast";
import type { z } from "zod";

export const Route = createLazyFileRoute("/trigger/assisant")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate({ from: "/trigger/assisant" });
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

  const form = useZodForm({
    schema: zAgentRunInput,
    defaultValues: {
      // input: '',
    },
  });

  const handleSubmit = (values: z.infer<typeof zAgentRunInput>) => {
    triggerWorkflowMutation.mutate({
      path: {
        // tenant: tenant!.metadata.id,
        // workflow: workflow.metadata.id,
        workflow: FlowNames.ASSISANT,
      },
      body: {
        // name: FlowNames.ASSISANT,
        input: values,
      },
    });
  };
  return (
    <div className="flex flex-col gap-4">
      <h1>assisant</h1>
      <ZForm className="" handleSubmit={handleSubmit} form={form}>
        <FormField
          control={form.control}
          name="params.messages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>主题</FormLabel>
              <FormControl>
                <Input placeholder="输入" {...field} />
              </FormControl>
              <FormDescription>messages</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </ZForm>
      <EditFormToolbar form={form} />
    </div>
  );
}
