import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { workflowRunCreateMutation } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import { useTenantId } from "../../../hooks/useAuth";
import { useWorkbenchStore } from "../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/resource/$resId/platform_account")({
  component: RouteComponent,
});

function RouteComponent() {
  const resId = Route.useParams();
  const trigger = useMutation({
    ...workflowRunCreateMutation(),
  });
  const tid = useTenantId();
  const triggerFlow = () => {
    console.log("triggerFlow");
    trigger.mutate({
      path: {
        workflow: "platform_account",
      },
      body: {
        input: {},
        // additionalMetadata: addlMetaObj,
      },
    });
  };

  const handleHumanInput = useWorkbenchStore((x) => x.handleHumanInput);
  return (
    <div>
      <h1>账号</h1>
      <Button
        onClick={() => {
          handleHumanInput({
            content: "运行这个资源",
            resourceId: resId,
          });
        }}
      >
        运行 FlowPlatformAccount
      </Button>
    </div>
  );
}
