"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { type Model, modelListOptions } from "mtmaiapi";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { TaskDateBadge } from "mtxuilib/mt/relative-date";
import { buttonVariants } from "mtxuilib/ui/button";
import { useTenantId } from "../../hooks/useAuth";

export function ModelListView() {
  // const listWorkflowQuery = useWorkflowsStore((x) => x.listWorkflowQuery);
  const tid = useTenantId();

  const modelQuery = useSuspenseQuery({
    ...modelListOptions({
      path: {
        tenant: tid,
      },
    }),
  });
  return (
    <div>
      {modelQuery.data?.rows?.map((row) => (
        <ModelListItem key={row.metadata?.id} row={row} />
      ))}
    </div>
  );
}

function ModelListItem({ row }: { row: Model }) {
  const workflowId = row.metadata.id;
  const workflowName = row.name;
  return (
    <div className="flex flex-col gap-2 mb-2 bg-blue-50 p-2 rounded-md">
      <div>
        <CustomLink to={`/workflows/${row.metadata.id}`}>{row.name}</CustomLink>
      </div>

      <div>
        <TaskDateBadge
          date_created_at={row.metadata.createdAt}
          date_updated_at={row.metadata.updatedAt}
        />
        <span className="text-sm text-muted-foreground">{row.name}</span>
        <span>
          <CustomLink
            to={`/workflows/${workflowId}/trigger/${workflowName}`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            启动
          </CustomLink>
        </span>
      </div>
    </div>
  );
}
