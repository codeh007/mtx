"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { capitalize } from "lodash";
import type { RateLimit } from "mtmaiapi/api";
import { DataTableColumnHeader } from "mtxuilib/data-table/data-table-column-header";
import { LimitIndicator } from "../../tenant-settings/resource-limits/components/resource-limit-columns";
import { RelativeDate } from "mtxuilib/mt/relative-date";
export type RateLimitRow = RateLimit & {
  metadata: {
    id: string;
  };
};

export const columns: ColumnDef<RateLimitRow>[] = [
  {
    accessorKey: "RateLimitKey",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Key" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-row items-center gap-4 pl-4">
        <LimitIndicator
          value={row.original.limitValue - row.original.value}
          alarmValue={row.original.limitValue / 2}
          limitValue={row.original.limitValue}
        />
        {row.original.key}
      </div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "Value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Value" />
    ),
    cell: ({ row }) => {
      return <div>{row.original.value}</div>;
    },
  },
  {
    accessorKey: "LimitValue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Limit" />
    ),
    cell: ({ row }) => {
      return <div>{row.original.limitValue}</div>;
    },
  },
  {
    accessorKey: "LastRefill",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Refill" />
    ),
    cell: ({ row }) => {
      return (
        <div>
          <RelativeDate date={row.original.lastRefill} />
        </div>
      );
    },
  },
  {
    accessorKey: "Window",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rate Limit Window" />
    ),
    cell: ({ row }) => {
      return <div>{capitalize(row.original.window)}</div>;
    },
  },
];