"use client";

import type { Workflow } from "mtmaiapi";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { TaskDateBadge } from "mtxuilib/mt/relative-date";
import { buttonVariants } from "mtxuilib/ui/button";
import { useWorkflowsStore } from "../../stores/workflow-store";

export function WorkflowListView() {
  const listWorkflowQuery = useWorkflowsStore((x) => x.listWorkflowQuery);
  return (
    <div>
      {listWorkflowQuery.data?.rows?.map((row) => (
        <WorkflowListItem key={row.metadata.id} row={row} />
      ))}
    </div>
  );
}

function WorkflowListItem({ row }: { row: Workflow }) {
  const workflowId = row.metadata.id;
  return (
    <div className="flex flex-col gap-2 mb-2 bg-blue-50 p-2 rounded-md">
      <div>
        <span>{/* <RunStatus status={row.status} /> */}</span>
        <CustomLink to={`/workflows/${row.metadata.id}`}>{row.name}</CustomLink>
      </div>

      <div>
        <TaskDateBadge
          date_created_at={row.metadata.createdAt}
          date_updated_at={row.metadata.updatedAt}
        />
        <span className="text-sm text-muted-foreground">
          {/* triggerBy:{row.triggeredBy.eventId} */}
        </span>
        <span className="text-sm text-muted-foreground">{row.name}</span>
        <span>
          <CustomLink
            to={`/workflows/${workflowId}/trigger`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Trigger
          </CustomLink>
        </span>
      </div>
    </div>
  );
}
