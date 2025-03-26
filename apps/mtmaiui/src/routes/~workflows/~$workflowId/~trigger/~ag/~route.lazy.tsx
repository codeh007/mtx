"use client";
import { useMutation } from "@tanstack/react-query";
import {
  Outlet,
  createLazyFileRoute,
  useNavigate,
} from "@tanstack/react-router";
import { FlowNames, workflowRunCreateMutation } from "mtmaiapi";
import { toast } from "mtxuilib/ui/use-toast";
import FlowForm from "../../../../../components/flow-form/FlowForm";

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

  return (
    <FlowForm workflowName={FlowNames.AG}>
      <Outlet />
    </FlowForm>
  );
}
