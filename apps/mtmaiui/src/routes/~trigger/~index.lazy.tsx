import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { triggerWorkflowMutation } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";

export const Route = createLazyFileRoute("/trigger/")({
  component: RouteComponent,
});

function RouteComponent() {
  const triggerWorkflow = useMutation({
    ...triggerWorkflowMutation(),
  });
  return (
    <>
      <Button
        onClick={() =>
          triggerWorkflow.mutate({
            body: {
              workflow: "123",
              input: {},
            },
          })
        }
      >
        运行工作流
      </Button>
    </>
  );
}
