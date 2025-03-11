import { createLazyFileRoute } from "@tanstack/react-router";
import { useWorkflowRunShape } from "../../../hooks/useWorkflowRun";
import { RunSummary } from "../components/header";
import { StepRunEvents } from "../components/step-run-events-for-workflow-run";

export const Route = createLazyFileRoute("/workflow-runs/$workflowRunId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { workflowRunId } = Route.useParams();
  const { shape } = useWorkflowRunShape(workflowRunId);
  // const tenant = useTenant()
  // useEffect(() => {
  //   if (
  //     sidebarState?.workflowRunId &&
  //     workflowRunId !== sidebarState?.workflowRunId
  //   ) {
  //     setSidebarState(undefined)
  //   }
  // }, [workflowRunId, sidebarState])
  // const view = useMtmaiV2((x) => x.preferredWorkflowRunView)

  return (
    <div className="mx-auto max-w-7xl pt-2 px-4 sm:px-6 lg:px-8">
      <div className="h-4" />
      <RunSummary data={shape.data} />
      <StepRunEvents
        workflowRun={shape.data}
        onClick={(stepRunId) =>
          setSidebarState(
            stepRunId === sidebarState?.stepRunId
              ? undefined
              : { stepRunId, workflowRunId: workflowRunId },
          )
        }
      />
    </div>
  );
}
