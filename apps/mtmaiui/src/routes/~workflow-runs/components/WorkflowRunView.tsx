"use Client";

interface WorkflowRunViewProps {
  runId: string;
}

export const WorkflowRunView = ({ runId }: WorkflowRunViewProps) => {
  return (
    <>
      <div className="bg-slate-100 p-2">WorkflowRunViewerV2 runId: {runId}</div>
      <div>{/* <DebugValue data={{ workflowRun }} /> */}</div>
    </>
  );
};
