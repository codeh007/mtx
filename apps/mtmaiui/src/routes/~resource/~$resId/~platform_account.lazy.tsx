import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { type InstagramTask, workflowRunCreateMutation } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import { useTenantId } from "../../../hooks/useAuth";
import { useWorkbenchStore } from "../../../stores/workbrench.store";
import { ChatClient } from "../../~play/~chat/chat/Chat.client";

export const Route = createLazyFileRoute("/resource/$resId/platform_account")({
  component: RouteComponent,
});

function RouteComponent() {
  const { resId } = Route.useParams();
  const trigger = useMutation({
    ...workflowRunCreateMutation(),
  });
  const tid = useTenantId();

  const handleHumanInput = useWorkbenchStore((x) => x.handleHumanInput);

  const handleRunWorkflow = () => {
    trigger.mutate({
      path: {
        workflow: "instagram",
      },
      body: {
        input: {
          content: "你好",
          resourceId: resId,
        } satisfies InstagramTask,

        // additionalMetadata: addlMetaObj,
      },
    });
  };

  return (
    <div>
      <div className="flex flex-row gap-2">
        <Button
          onClick={() => {
            handleHumanInput({
              content: "运行这个资源",
              resourceId: resId,
            });
          }}
        >
          运行platform_account
        </Button>

        <Button onClick={handleRunWorkflow}>运行工作流</Button>
      </div>
      <div>
        <ChatClient />
      </div>
    </div>
  );
}
