"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Event } from "mtmaiapi/api";

import { DataTable } from "mtxuilib/data-table/data-table";
import { DataTableColumnHeader } from "mtxuilib/data-table/data-table-column-header";
import { RelativeDate } from "mtxuilib/mt/relative-date";
import { Badge } from "mtxuilib/ui/badge";
import { Button } from "mtxuilib/ui/button";
import { Checkbox } from "mtxuilib/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "mtxuilib/ui/popover";
import { useMemo, useState } from "react";
import { useTenant } from "../../hooks";
import { useMtmClient } from "../../hooks/useMtmapi";
import { columns as workflowRunsColumns } from "../../modules/workflow-run/workflow-runs-columns";
import { AdditionalMetadata } from "./additional-metadata";

export const columns = ({
  onRowClick,
}: {
  onRowClick?: (row: Event) => void;
}): ColumnDef<Event>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "EventId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Event Id" />
      ),
      cell: ({ row }) => (
        <div className="w-full">{row.original.metadata.id}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "key",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Event" />
      ),
      cell: ({ row }) => (
        <div className="w-full">
          <Button
            className="w-fit cursor-pointer pl-0"
            variant="link"
            onClick={() => {
              onRowClick?.(row.original);
            }}
          >
            {row.getValue("key")}
          </Button>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "Seen at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Seen at" />
      ),
      cell: ({ row }) => {
        return (
          <div>
            <RelativeDate date={row.original.metadata.createdAt} />
          </div>
        );
      },
    },
    // empty columns to get column filtering to work properly
    {
      accessorKey: "workflows",
      header: () => <></>,
      cell: () => {
        return <div />;
      },
    },
    {
      accessorKey: "status",
      header: () => <></>,
      cell: () => {
        return <div />;
      },
    },
    {
      accessorKey: "Workflow Runs",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Workflow Runs" />
      ),
      cell: ({ row }) => {
        if (!row.original.workflowRunSummary) {
          return <div>None</div>;
        }

        return <WorkflowRunSummary event={row.original} />;
      },
    },
    {
      accessorKey: "Metadata",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Metadata" />
      ),
      cell: ({ row }) => {
        if (!row.original.additionalMetadata) {
          return <div />;
        }

        return (
          <AdditionalMetadata metadata={row.original.additionalMetadata} />
        );
      },
      enableSorting: false,
    },
    // {
    //   id: "actions",
    //   cell: ({ row }) => <DataTableRowActions row={row} labels={[]} />,
    // },
  ];
};

// eslint-disable-next-line react-refresh/only-export-components
function WorkflowRunSummary({ event }: { event: Event }) {
  const tenant = useTenant();

  const mtmapi = useMtmClient();

  const [hoverCardOpen, setPopoverOpen] = useState<
    "failed" | "succeeded" | "running" | "queued" | "pending"
  >();

  const numFailed = event.workflowRunSummary?.failed || 0;
  const numSucceeded = event.workflowRunSummary?.succeeded || 0;
  const numRunning = event.workflowRunSummary?.running || 0;
  const numPending = event.workflowRunSummary?.pending || 0;
  const numQueued = event.workflowRunSummary?.queued || 0;

  const listWorkflowRunsQuery = mtmapi.useQuery(
    "get",
    "/api/v1/tenants/{tenant}/workflows/runs",
    {
      params: {
        path: {
          tenant: tenant.metadata.id,
        },
      },
    },
    {
      enabled: !!hoverCardOpen,
    },
  );

  const workflowRuns = useMemo(() => {
    return (
      listWorkflowRunsQuery.data?.rows?.filter((run) => {
        if (hoverCardOpen) {
          if (hoverCardOpen === "failed") {
            return run.status === "FAILED";
          }
          if (hoverCardOpen === "succeeded") {
            return run.status === "SUCCEEDED";
          }
          if (hoverCardOpen === "running") {
            return run.status === "RUNNING";
          }
          if (hoverCardOpen === "pending") {
            return run.status === "PENDING";
          }
          if (hoverCardOpen === "queued") {
            return run.status === "QUEUED";
          }
        }

        return false;
      }) || []
    );
  }, [listWorkflowRunsQuery, hoverCardOpen]);

  const hoverCardContent = (
    <div className="min-w-fit z-40 bg-white/10 rounded">
      <DataTable
        columns={workflowRunsColumns()}
        data={workflowRuns}
        filters={[]}
        pageCount={0}
        columnVisibility={{
          select: false,
          "Triggered by": false,
          actions: false,
          Metadata: false,
        }}
        showColumnToggle={false}
        isLoading={listWorkflowRunsQuery.isLoading}
      />
    </div>
  );

  return (
    <div className="flex flex-row gap-2 items-center justify-start">
      {numFailed > 0 && (
        <Popover
          open={hoverCardOpen === "failed"}
          // open={true}
          onOpenChange={(open) => {
            if (!open) {
              setPopoverOpen(undefined);
            }
          }}
        >
          <PopoverTrigger>
            <Badge
              variant="failed"
              className="cursor-pointer"
              onClick={() => setPopoverOpen("failed")}
            >
              {numFailed} Failed
            </Badge>
          </PopoverTrigger>
          <PopoverContent
            className="min-w-fit p-0 bg-background border-none z-40"
            align="end"
          >
            {hoverCardContent}
          </PopoverContent>
        </Popover>
      )}
      {numSucceeded > 0 && (
        <Popover
          open={hoverCardOpen === "succeeded"}
          onOpenChange={(open) => {
            if (!open) {
              setPopoverOpen(undefined);
            }
          }}
        >
          <PopoverTrigger>
            <Badge
              variant="successful"
              className="cursor-pointer"
              onClick={() => setPopoverOpen("succeeded")}
            >
              {numSucceeded} Succeeded
            </Badge>
          </PopoverTrigger>
          <PopoverContent
            className="min-w-fit p-0 bg-background border-none z-40"
            align="end"
          >
            {hoverCardContent}
          </PopoverContent>
        </Popover>
      )}
      {numRunning > 0 && (
        <Popover
          open={hoverCardOpen === "running"}
          onOpenChange={(open) => {
            if (!open) {
              setPopoverOpen(undefined);
            }
          }}
        >
          <PopoverTrigger>
            <Badge
              variant="inProgress"
              className="cursor-pointer"
              onClick={() => setPopoverOpen("running")}
            >
              {numRunning} Running
            </Badge>
          </PopoverTrigger>
          <PopoverContent
            className="min-w-fit p-0 bg-background border-none z-40"
            align="end"
          >
            {hoverCardContent}
          </PopoverContent>
        </Popover>
      )}
      {numPending > 0 && (
        <Popover
          open={hoverCardOpen === "pending"}
          onOpenChange={(open) => {
            if (!open) {
              setPopoverOpen(undefined);
            }
          }}
        >
          <PopoverTrigger>
            <Badge
              variant="inProgress"
              className="cursor-pointer"
              onClick={() => setPopoverOpen("pending")}
            >
              {numPending} Pending
            </Badge>
          </PopoverTrigger>
          <PopoverContent
            className="min-w-fit p-0 bg-background border-none z-40"
            align="end"
          >
            {hoverCardContent}
          </PopoverContent>
        </Popover>
      )}
      {numQueued > 0 && (
        <Popover
          open={hoverCardOpen === "queued"}
          onOpenChange={(open) => {
            if (!open) {
              setPopoverOpen(undefined);
            }
          }}
        >
          <PopoverTrigger>
            <Badge
              variant="inProgress"
              className="cursor-pointer"
              onClick={() => setPopoverOpen("queued")}
            >
              {numQueued} Queued
            </Badge>
          </PopoverTrigger>
          <PopoverContent
            className="min-w-fit p-0 bg-background border-none z-40"
            align="end"
          >
            {hoverCardContent}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}