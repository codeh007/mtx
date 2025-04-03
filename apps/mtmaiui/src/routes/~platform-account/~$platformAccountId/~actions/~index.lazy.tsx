import { createLazyFileRoute } from "@tanstack/react-router";
import { FlowNames, type PlatformAccountFlowInput } from "mtmaiapi";
import { ZForm, useZodFormV2 } from "mtxuilib/mt/form/ZodForm";
import { Button } from "mtxuilib/ui/button";
import { z } from "zod";
import { useWorkflowRun } from "../../../../hooks/useWorkflowRun";
import { WorkflowRunView } from "../../../~workflow-runs/components/WorkflowRunView";

export const Route = createLazyFileRoute(
  "/platform-account/$platformAccountId/actions/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { platformAccountId } = Route.useParams();
  const { handleRun, workflowRunData } = useWorkflowRun(
    FlowNames.PLATFORM_ACCOUNT,
    {
      type: "PlatformAccountFlowInput",
      platform_account_id: platformAccountId,
    } satisfies PlatformAccountFlowInput,
  );

  const form = useZodFormV2({
    toastValidateError: true,
    schema: z.object({
      username: z.string(),
      password: z.string(),
    }),
    handleSubmit: (data) => {
      console.log(data);
    },
  });
  return (
    <div className="flex flex-col gap-4 p-2">
      <h1>登录社交媒体</h1>
      <ZForm {...form}>
        <Button onClick={handleRun}>登录</Button>
      </ZForm>
      {workflowRunData && (
        <WorkflowRunView runId={workflowRunData.metadata.id} />
      )}
    </div>
  );
}
