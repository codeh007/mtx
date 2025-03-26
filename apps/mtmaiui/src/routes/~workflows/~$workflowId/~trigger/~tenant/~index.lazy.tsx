import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { FlowNames, workflowRunCreateMutation } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import { useToast } from "mtxuilib/ui/use-toast";
import { useNav } from "../../../../../hooks/useNav";

export const Route = createLazyFileRoute(
  "/workflows/$workflowId/trigger/tenant/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const toast = useToast();
  const nav = useNav();
  const handleNavToWorkflowRun = (id: string) => {
    nav({
      to: `/workflow-runs/${id}`,
    });
  };
  const workflowRunCreate = useMutation({
    ...workflowRunCreateMutation(),
    onSuccess: (resp) => {
      toast.toast({
        title: "Workflow run created",
        description: (
          <div>
            <Button onClick={() => handleNavToWorkflowRun(resp?.metadata?.id)}>
              View Workflow
            </Button>
          </div>
        ),
      });
    },
  });
  const handleClick = async () => {
    workflowRunCreate.mutate({
      path: {
        workflow: FlowNames.TENANT,
      },
      body: {
        input: {},
      },
    });
  };
  return (
    <>
      <Button onClick={handleClick}>运行</Button>
    </>
  );
}
