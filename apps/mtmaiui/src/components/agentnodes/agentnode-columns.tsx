"use client";
import type { ColumnDef } from "@tanstack/react-table";
import type { components } from "mtmaiapi/query_client/generated";
import { DataTableColumnHeader } from "mtxuilib/data-table/data-table-column-header";
import { RelativeDate } from "mtxuilib/mt/relative-date";
import Link from "next/link";

export const columns: ColumnDef<components["schemas"]["AgentNode"]>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Link href={`/workers/${row.original.metadata.id}`}>
        <div className="cursor-pointer hover:underline min-w-fit whitespace-nowrap">
          {row.original.status}
        </div>
      </Link>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <Link href={`/workers/${row.original.metadata.id}`}>
        <div className="cursor-pointer hover:underline min-w-fit whitespace-nowrap">
          {row.original.webhookUrl || row.original.name}
        </div>
      </Link>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <div className="cursor-pointer hover:underline min-w-fit whitespace-nowrap">
        {row.original.type}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "startedAt",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Started at"
        className="whitespace-nowrap"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="whitespace-nowrap">
          <RelativeDate date={row.original.metadata.createdAt} />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "lastHeartbeatAt",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Last seen"
        className="whitespace-nowrap"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="whitespace-nowrap">
          {row.original.lastHeartbeatAt && (
            <RelativeDate date={row.original.lastHeartbeatAt} />
          )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: true,
  },
];
