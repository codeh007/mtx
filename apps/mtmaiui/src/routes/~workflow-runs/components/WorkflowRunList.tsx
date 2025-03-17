"use client";

import type { WorkflowRun } from "mtmaiapi";
import { formatDuration } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { RelativeDate } from "mtxuilib/mt/relative-date";
import { useWorkflowRunStore } from "../../../stores/workflowRunStore";
import { RunStatus } from "./run-statuses";

export function WorkflowRunList() {
  const listWorkflowRunsData = useWorkflowRunStore(
    (x) => x.listWorkflowRunsData,
  );
  return (
    <div>
      {listWorkflowRunsData?.rows?.map((row) => (
        <WorkflowRunListItem key={row.metadata.id} row={row} />
      ))}
    </div>
  );
}

function WorkflowRunListItem({ row }: { row: WorkflowRun }) {
  const workflow = row.workflowVersion?.workflow;
  return (
    <div className="flex flex-col gap-2 mb-2 bg-amber-50 p-2 rounded-md">
      <div>
        <CustomLink to={`/workflow-runs/${row.metadata.id}`}>
          {row.displayName}
        </CustomLink>
      </div>
      <div>
        <RunStatus status={row.status} />
      </div>
      <div className="whitespace-nowrap">
        <span className="text-sm text-muted-foreground">用时:</span>
        {row.duration ? formatDuration(row.duration) : "N/A"}
        <div>
          完成于:{" "}
          {row.finishedAt ? <RelativeDate date={row.finishedAt} /> : "N/A"}
        </div>
        <div>
          开始于:{" "}
          {row.startedAt ? <RelativeDate date={row.startedAt} /> : "N/A"}
        </div>
        <div>
          创建于:{" "}
          {row.metadata.createdAt ? (
            <RelativeDate date={row.metadata.createdAt} />
          ) : (
            "N/A"
          )}
        </div>
        <span className="text-sm text-muted-foreground">triggerBy:</span>
        <div>{row.triggeredBy.eventId}</div>
        <span className="text-sm text-muted-foreground">
          workflow:{workflow?.name}
        </span>
      </div>
    </div>
  );
}
