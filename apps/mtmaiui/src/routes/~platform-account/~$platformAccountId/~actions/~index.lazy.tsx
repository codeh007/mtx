import { createLazyFileRoute } from "@tanstack/react-router";
import { FlowNames, type PlatformAccountFlowInput } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import { useWorkflowRun } from "../../../../hooks/useWorkflowRun";

export const Route = createLazyFileRoute(
  "/platform-account/$platformAccountId/actions/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { platformAccountId } = Route.useParams();
  const { handleRun } = useWorkflowRun(FlowNames.PLATFORM_ACCOUNT, {
    type: "PlatformAccountFlowInput",
    platform_account_id: platformAccountId,
  } satisfies PlatformAccountFlowInput);
  return (
    <div>
      <h1>登录社交媒体</h1>
      <Button onClick={handleRun}>登录</Button>
    </div>
  );
}
