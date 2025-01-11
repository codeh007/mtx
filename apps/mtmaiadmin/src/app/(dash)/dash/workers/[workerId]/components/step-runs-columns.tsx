"use client";
import type { ColumnDef } from "@tanstack/react-table";
import type { RecentStepRuns } from "mtmaiapi/api";
import { RunStatus } from "mtmaiui/modules/workflow-run/run-statuses";
import { DataTableColumnHeader } from "mtxuilib/data-table/data-table-column-header";
import { relativeDate } from "mtxuilib/lib/utils";
import { RelativeDate } from "mtxuilib/mt/relative-date";
import Link from "next/link";

export const columns: ColumnDef<RecentStepRuns>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => {
      return (
        <Link href={`/workflow-runs/${row.original.workflowRunId}`}>
          <div className="pl-0 cursor-pointer hover:underline min-w-fit whitespace-nowrap">
            {row.original.actionId}
          </div>
        </Link>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <RunStatus status={row.original.status} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Started at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Started at" />
    ),
    cell: ({ row }) => {
      return (
        <div>
          {row.original.startedAt && (
            <RelativeDate date={row.original.startedAt} />
          )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Finished at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Finished at" />
    ),
    cell: ({ row }) => {
      const finishedAt = row.original.finishedAt
        ? relativeDate(row.original.finishedAt)
        : "N/A";

      return <div>{finishedAt}</div>;
    },
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} labels={[]} />,
  // },
];
