"use client";
import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { FlowNames, workflowRunCreateMutation } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import { toast } from "mtxuilib/ui/use-toast";
import { useTenant } from "../../hooks/useAuth";

export const Route = createLazyFileRoute("/trigger/tenant")({
  component: RouteComponent,
});

function RouteComponent() {
  const tenant = useTenant();
  const navigate = useNavigate({ from: "/trigger/tenant" });
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

  return (
    <div className="flex flex-col gap-4">
      <h1>重置 tenant 数据</h1>
      <Button
        disabled={triggerWorkflowMutation.isPending}
        onClick={() =>
          triggerWorkflowMutation.mutate({
            path: {
              workflow: FlowNames.TENANT,
            },
            body: {
              input: {},
              additionalMetadata: {},
            },
          })
        }
      >
        提交
      </Button>
    </div>
  );
}
