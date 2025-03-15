import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { MtTabs, MtTabsList, MtTabsTrigger } from "mtxuilib/mt/tabs";
import { Sheet, SheetContent } from "mtxuilib/ui/sheet";
import { useEffect, useState } from "react";
import { useTenant } from "../../../hooks/useAuth";
import { useWorkflowRunShape } from "../../../hooks/useWorkflowRun";
import type { WorkflowRunSidebarState } from "../../../types/types";
import { RunDetailHeader } from "../components/header";
import { StepRunDetail } from "../components/step-run-detail/step-run-detail";

export const Route = createLazyFileRoute("/workflow-runs/$workflowRunId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { workflowRunId } = Route.useParams();
  const { shape } = useWorkflowRunShape(workflowRunId);
  const [sidebarState, setSidebarState] = useState<WorkflowRunSidebarState>();
  const tenant = useTenant();
  useEffect(() => {
    if (
      sidebarState?.workflowRunId &&
      workflowRunId !== sidebarState?.workflowRunId
    ) {
      setSidebarState(undefined);
    }
  }, [workflowRunId, sidebarState]);
  // const view = useMtmaiV2((x) => x.preferredWorkflowRunView);
  return (
    <>
      <RunDetailHeader
        loading={shape.isLoading}
        data={shape.data}
        refetch={() => shape.refetch()}
      />
      <MtTabs defaultValue="activity">
        <MtTabsList layout="underlined">
          <CustomLink to="">
            <MtTabsTrigger variant="underlined" value="activity">
              活动
            </MtTabsTrigger>
          </CustomLink>
          <CustomLink to="input">
            <MtTabsTrigger variant="underlined" value="input">
              输入
            </MtTabsTrigger>
          </CustomLink>
          <CustomLink to="additional-metadata">
            <MtTabsTrigger variant="underlined" value="additional-metadata">
              元数据
            </MtTabsTrigger>
          </CustomLink>
          <MtTabsTrigger variant="underlined" value="control">
            调试
          </MtTabsTrigger>
          <CustomLink to="visualization">
            <MtTabsTrigger variant="underlined" value="visualization">
              可视化
            </MtTabsTrigger>
          </CustomLink>
          <CustomLink to="chat">
            <MtTabsTrigger variant="underlined" value="agent_visualization">
              智能体交互
            </MtTabsTrigger>
          </CustomLink>
        </MtTabsList>

        {/* <MtTabsContent value="activity">
          {!shape.isLoading && shape.data && (
            <MtSuspenseBoundary>
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
            </MtSuspenseBoundary>
          )}
        </MtTabsContent> */}
        {/* <MtTabsContent value="input">
          <MtSuspenseBoundary>
            {shape.data && <WorkflowRunInputDialog run={shape.data} />}
          </MtSuspenseBoundary>
        </MtTabsContent> */}
        {/* <MtTabsContent value="additional-metadata">
          <MtSuspenseBoundary>
            <CodeHighlighter
              className="my-1"
              language="json"
              code={JSON.stringify(shape.data?.additionalMetadata, null, 2)}
            />
          </MtSuspenseBoundary>
        </MtTabsContent> */}
        {/* <MtTabsContent value="control">
          <DebugValue data={{ workflowRunId, shape }} />
        </MtTabsContent> */}
        {/* <MtTabsContent value="visualization">
          <MtSuspenseBoundary>
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
              {shape.data &&
                (view === "minimap" || !hasChildSteps(shape.data)) && (
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
          </MtSuspenseBoundary>
        </MtTabsContent> */}
        {/* <MtTabsContent value="agent_visualization">
          <MtSuspenseBoundary>智能体交互(未完成功能开发中)</MtSuspenseBoundary>
        </MtTabsContent> */}
      </MtTabs>
      <div className="flex-grow h-full w-full">
        <MtSuspenseBoundary>
          <Outlet />
        </MtSuspenseBoundary>

        {shape.data && (
          <Sheet
            open={!!sidebarState}
            onOpenChange={(open) =>
              open ? undefined : setSidebarState(undefined)
            }
          >
            <SheetContent className="w-fit min-w-[56rem] max-w-4xl sm:max-w-2xl z-[60]">
              {sidebarState?.stepRunId && (
                <MtSuspenseBoundary>
                  <StepRunDetail
                    // tenant={tenant!}
                    stepRunId={sidebarState?.stepRunId}
                    workflowRun={shape.data}
                    defaultOpenTab={sidebarState?.defaultOpenTab}
                  />
                </MtSuspenseBoundary>
              )}
            </SheetContent>
          </Sheet>
        )}
      </div>
    </>
  );
}
