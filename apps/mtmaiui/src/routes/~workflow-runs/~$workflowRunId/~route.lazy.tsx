import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { useWorkflowRunShape } from "../../../hooks/useWorkflowRun";
import RunDetailHeader from "../components/header";

export const Route = createLazyFileRoute("/workflow-runs/$workflowRunId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { workflowRunId } = Route.useParams();
  const { shape } = useWorkflowRunShape(workflowRunId);

  return (
    <>
      <RunDetailHeader
        loading={shape.isLoading}
        data={shape.data}
        refetch={() => shape.refetch()}
      />
      <Outlet />
    </>
  );
}
