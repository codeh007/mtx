"use client";
import type { StepRun, WorkflowRunShape } from "mtmaiapi";
import { type Step, WorkflowRunStatus } from "mtmaiapi/api";
import { DataTable } from "mtxuilib/data-table/data-table";
import { useMemo } from "react";
import { useMtmClient } from "../../../hooks/useMtmapi";
import { type ActivityEventData, columns } from "./events-columns";

export function StepRunEvents({
  workflowRun,
  filteredStepRunId,
  onClick,
}: {
  workflowRun: WorkflowRunShape;
  filteredStepRunId?: string;
  onClick?: (stepRunId?: string) => void;
}) {
  const mtmapi = useMtmClient();
  const eventsQuery = mtmapi.useQuery(
    "get",
    "/api/v1/tenants/{tenant}/workflow-runs/{workflow-run}/step-run-events",
    {
      params: {
        path: {
          tenant: workflowRun.tenantId,
          "workflow-run": workflowRun.metadata.id,
        },
      },
    },
    {
      refetchInterval: () => {
        if (workflowRun.status === WorkflowRunStatus.RUNNING) {
          return 1000;
        }
        return 5000;
      },
    },
  );

  const filteredEvents = useMemo(() => {
    if (!filteredStepRunId) {
      return eventsQuery.data?.rows || [];
    }

    return eventsQuery.data?.rows?.filter(
      (x) => x.stepRunId === filteredStepRunId,
    );
  }, [eventsQuery.data, filteredStepRunId]);

  const stepRuns = useMemo(() => {
    return (
      workflowRun.jobRuns?.flatMap((jr) => jr.stepRuns).filter((x) => !!x) ||
      ([] as StepRun[])
    );
  }, [workflowRun]);

  const steps = useMemo(() => {
    return (
      (
        workflowRun.jobRuns
          ?.flatMap((jr) => jr.job?.steps)
          .filter((x) => !!x) || ([] as Step[])
      ).flat() || ([] as Step[])
    );
  }, [workflowRun]);

  const normalizedStepRunsByStepRunId = useMemo(() => {
    return stepRuns.reduce(
      (acc, stepRun) => {
        if (!stepRun) {
          return acc;
        }

        acc[stepRun.metadata.id] = stepRun;
        return acc;
      },
      {} as Record<string, StepRun>,
    );
  }, [stepRuns]);

  const normalizedStepsByStepRunId = useMemo(() => {
    return stepRuns.reduce(
      (acc, stepRun) => {
        if (!stepRun) {
          return acc;
        }

        const step = steps?.find((s) => s?.metadata.id === stepRun.stepId);
        if (step && stepRun) {
          acc[stepRun.metadata.id] = step;
        }
        return acc;
      },
      {} as Record<string, Step>,
    );
  }, [steps, stepRuns]);

  const tableData: ActivityEventData[] =
    filteredEvents?.map((item) => {
      return {
        metadata: {
          id: `${item.id}`,
          createdAt: item.timeFirstSeen,
          updatedAt: item.timeLastSeen,
        },
        event: item,
        stepRun: item.stepRunId
          ? normalizedStepRunsByStepRunId[item.stepRunId]
          : undefined,
        step: item.stepRunId
          ? normalizedStepsByStepRunId[item.stepRunId]
          : undefined,
      };
    }) || [];

  const cols = columns({
    onRowClick: onClick
      ? (row) => onClick(row.stepRun?.metadata.id)
      : undefined,
    allEvents: tableData,
  });

  return (
    <DataTable
      emptyState={<>No events found.</>}
      isLoading={eventsQuery.isLoading}
      columns={cols}
      filters={[]}
      data={tableData}
    />
  );
}
