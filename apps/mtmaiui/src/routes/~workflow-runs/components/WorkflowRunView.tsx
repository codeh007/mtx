"use Client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  type WorkflowRun,
  workflowRunGetMetricsOptions,
  workflowRunGetOptions,
} from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useState } from "react";
// import { toast } from "mtxuilib/ui/use-toast";
import { useTenantId } from "../../../hooks/useAuth";

interface WorkflowRunViewProps {
  runId: string;
}

export const WorkflowRunView = ({ runId }: WorkflowRunViewProps) => {
  const tid = useTenantId();

  const [workflowRunData, setWorkflowRunData] = useState<WorkflowRun | null>(
    null,
  );

  const workflowRun = useSuspenseQuery({
    ...workflowRunGetOptions({
      path: {
        tenant: tid,
        "workflow-run": runId,
      },
    }),
  });

  const agStateQuery = useQuery({
    ...workflowRunGetMetricsOptions({
      path: {
        tenant: tid,
        // "workflow-run": runId,
      },
    }),
    enabled: !!workflowRun.data,
  });
  return (
    <>
      <div className="bg-slate-100 p-2">WorkflowRunViewerV2 runId: {runId}</div>
      <div>
        <DebugValue data={{ workflowRun }} />
      </div>
    </>
  );
};
