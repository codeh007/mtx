import { createFileRoute } from "@tanstack/react-router";
import { MtErrorBoundary } from "mtxuilib/components/MtErrorBoundary";
import { CodeHighlighter } from "mtxuilib/mt/code-highlighter";
import {
  MtTabs,
  MtTabsContent,
  MtTabsList,
  MtTabsTrigger,
} from "mtxuilib/mt/tabs";
import { Separator } from "mtxuilib/ui/separator";
import { Sheet, SheetContent } from "mtxuilib/ui/sheet";
import { useEffect, useState } from "react";
import { useTenant } from "../../hooks/useAuth";
import { useWorkflowRunShape } from "../../hooks/useWorkflowRun";
import { useMtmaiV2 } from "../../stores/StoreProvider";
import RunDetailHeader from "./components/header";
import { MiniMap } from "./components/mini-map";
import {
  StepRunDetail,
  TabOption,
} from "./components/step-run-detail/step-run-detail";
import { StepRunEvents } from "./components/step-run-events-for-workflow-run";
import { ViewToggle, hasChildSteps } from "./components/view-toggle";
import { WorkflowRunInputDialog } from "./components/workflow-run-input";
import WorkflowRunVisualizer from "./components/workflow-run-visualizer-v2";

export const Route = createFileRoute("/workflow-runs/$workflowRunId")({
  component: RouteComponent,
});
interface WorkflowRunSidebarState {
  workflowRunId?: string;
  stepRunId?: string;
  defaultOpenTab?: TabOption;
}
function RouteComponent() {
  const tenant = useTenant();
  if (!tenant) {
    return <div>require tenant</div>;
  }
  const { workflowRunId } = Route.useParams();
  const [sidebarState, setSidebarState] = useState<WorkflowRunSidebarState>();
  const { shape } = useWorkflowRunShape(workflowRunId);
  useEffect(() => {
    if (
      sidebarState?.workflowRunId &&
      workflowRunId !== sidebarState?.workflowRunId
    ) {
      setSidebarState(undefined);
    }
  }, [workflowRunId, sidebarState]);
  const view = useMtmaiV2((x) => x.preferredWorkflowRunView);

  return (
    <div className="flex-grow h-full w-full">
      <div className="mx-auto max-w-7xl pt-2 px-4 sm:px-6 lg:px-8">
        <RunDetailHeader
          loading={shape.isLoading}
          data={shape.data}
          refetch={() => shape.refetch()}
        />
        <Separator className="my-2" />
        <div className="w-full h-fit flex overflow-auto relative bg-slate-100 dark:bg-slate-900">
          {shape.data && view === "graph" && hasChildSteps(shape.data) && (
            <WorkflowRunVisualizer
              shape={shape.data}
              selectedStepRunId={sidebarState?.stepRunId}
              setSelectedStepRunId={(stepRunId) => {
                setSidebarState({
                  stepRunId,
                  defaultOpenTab: TabOption.Output,
                  workflowRunId: workflowRunId,
                });
              }}
            />
          )}
          {shape.data && (view === "minimap" || !hasChildSteps(shape.data)) && (
            <MiniMap
              shape={shape.data}
              selectedStepRunId={sidebarState?.stepRunId}
              onClick={(stepRunId, defaultOpenTab?: TabOption) =>
                setSidebarState(
                  stepRunId === sidebarState?.stepRunId
                    ? undefined
                    : {
                        stepRunId,
                        defaultOpenTab,
                        workflowRunId: workflowRunId,
                      },
                )
              }
            />
          )}
          {shape.data && <ViewToggle shape={shape.data} />}
        </div>
        <div className="h-4" />
        <MtTabs defaultValue="activity">
          <MtTabsList layout="underlined">
            <MtTabsTrigger variant="underlined" value="activity">
              Activity
            </MtTabsTrigger>
            <MtTabsTrigger variant="underlined" value="input">
              输入
            </MtTabsTrigger>
            <MtTabsTrigger variant="underlined" value="additional-metadata">
              元数据
            </MtTabsTrigger>
            <MtTabsTrigger variant="underlined" value="control">
              控制
            </MtTabsTrigger>
          </MtTabsList>
          <MtTabsContent value="activity">
            <div className="h-4" />
            {!shape.isLoading && shape.data && (
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
            )}
          </MtTabsContent>
          <MtTabsContent value="input">
            <MtErrorBoundary>
              {shape.data && <WorkflowRunInputDialog run={shape.data} />}
            </MtErrorBoundary>
          </MtTabsContent>
          <MtTabsContent value="additional-metadata">
            <CodeHighlighter
              className="my-4"
              language="json"
              code={JSON.stringify(shape.data?.additionalMetadata, null, 2)}
            />
          </MtTabsContent>
          <MtTabsContent value="control">
            <div className="h-4" />
            TODO 交互
          </MtTabsContent>
        </MtTabs>
      </div>
      {shape.data && (
        <Sheet
          open={!!sidebarState}
          onOpenChange={(open) =>
            open ? undefined : setSidebarState(undefined)
          }
        >
          <SheetContent className="w-fit min-w-[56rem] max-w-4xl sm:max-w-2xl z-[60]">
            {sidebarState?.stepRunId && (
              <StepRunDetail
                tenant={tenant}
                stepRunId={sidebarState?.stepRunId}
                workflowRun={shape.data}
                defaultOpenTab={sidebarState?.defaultOpenTab}
              />
            )}
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
