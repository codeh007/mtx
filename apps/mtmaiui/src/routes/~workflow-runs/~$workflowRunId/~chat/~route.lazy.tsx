import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { useWorkflowRunShape } from "../../../../hooks/useWorkflowRun";
import { WorkbrenchProvider } from "../../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/workflow-runs/$workflowRunId/chat")({
  component: RouteComponent,
});

function RouteComponent() {
  const { workflowRunId } = Route.useParams();
  const { shape } = useWorkflowRunShape(workflowRunId);

  const additionalMetadata = shape.data?.additionalMetadata;

  return (
    <>
      <WorkbrenchProvider
        componentId={additionalMetadata?.componentId as string}
      >
        <Outlet />
      </WorkbrenchProvider>
    </>
  );
}
