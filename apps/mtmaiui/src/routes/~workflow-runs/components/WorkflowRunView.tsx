"use Client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  WorkflowRunStatus,
  agStateGetOptions,
  workflowRunGetOptions,
} from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useMemo } from "react";
import { useTenantId } from "../../../hooks/useAuth";
import { AgStateView } from "../../~ag_state/components/AgStateView";
import { useGraphStore } from "../../../stores/GraphContext";

interface WorkflowRunViewProps {
  runId: string;
}

export const WorkflowRunView = ({ runId }: WorkflowRunViewProps) => {
  const tid = useTenantId();
  const sessionId = useGraphStore((x) => x.threadId);
  const workflowRun = useSuspenseQuery({
    ...workflowRunGetOptions({
      path: {
        tenant: tid,
        "workflow-run": runId,
      },
    }),
  });

  const agStateQuery = useQuery({
    ...agStateGetOptions({
      path: {
        tenant: tid,
      },
      query: {
        run: runId,
        // state: "workflow-run",
      },
    }),
    enabled: !!workflowRun.data,
  });

  const statusText = useMemo(() => {
    return workflowRun.data?.status;
  }, [workflowRun.data?.status]);

  return (
    <>
      <div className="bg-slate-100 p-2">runId: {runId}</div>
      <div>sessionId: {sessionId}</div>
      <div>
        <DebugValue data={{ workflowRun }} />
        {statusText === WorkflowRunStatus.RUNNING && <div>运行中</div>}
        {statusText === WorkflowRunStatus.SUCCEEDED && agStateQuery.data && (
          <div>
            <AgStateView agState={agStateQuery.data} />
          </div>
        )}
      </div>
    </>
  );
};
