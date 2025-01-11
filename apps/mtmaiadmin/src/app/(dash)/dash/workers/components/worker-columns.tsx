"use client";
import type { ColumnDef } from "@tanstack/react-table";
import type { Worker } from "mtmaiapi/api";
import { DataTableColumnHeader } from "mtxuilib/data-table/data-table-column-header";
import { RelativeDate } from "mtxuilib/mt/relative-date";
import Link from "next/link";
import { SdkInfo } from "./sdk-info";
import { useBasePath } from "mtmaiui/hooks/useBasePath";

export const columns: ColumnDef<Worker>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const basePath = useBasePath();
      return (
        <Link href={`${basePath}/workers/${row.original.metadata.id}`}>
          <div className="cursor-pointer hover:underline min-w-fit whitespace-nowrap">
            {row.original.status}
          </div>
        </Link>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const basePath = useBasePath();
      return (
        <Link href={`${basePath}/workers/${row.original.metadata.id}`}>
          <div className="cursor-pointer hover:underline min-w-fit whitespace-nowrap">
            {row.original.webhookUrl || row.original.name}
          </div>
        </Link>
      );
    },
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
  {
    accessorKey: "runtime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SDK Version" />
    ),
    cell: ({ row }) => <SdkInfo runtimeInfo={row.original.runtimeInfo} />,
    enableSorting: false,
    enableHiding: true,
  },
];
