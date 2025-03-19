"use client";
import { useMutation } from "@tanstack/react-query";
import {
  Outlet,
  createLazyFileRoute,
  useNavigate,
} from "@tanstack/react-router";
import { FlowNames, workflowRunCreateMutation } from "mtmaiapi";
import { zAgentRunInput } from "mtmaiapi/gomtmapi/zod.gen";
import { useZodForm } from "mtxuilib/mt/form/ZodForm";
import { toast } from "mtxuilib/ui/use-toast";
import type { z } from "zod";

export const Route = createLazyFileRoute("/workflows/$workflowId/trigger/ag")({
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
      <h1>AG</h1>
      <Outlet />
    </div>
  );
}
