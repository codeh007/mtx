import type { ColumnDef } from "@tanstack/react-table";
import CronPrettifier from "cronstrue";
import type { CronWorkflows, RateLimit } from "mtmaiapi/api";
import { DataTableColumnHeader } from "mtxuilib/data-table/data-table-column-header";
import { RelativeDate } from "mtxuilib/mt/relative-date";

import Link from "next/link";

export type RateLimitRow = RateLimit & {
  metadata: {
    id: string;
  };
};

export const columns: ColumnDef<CronWorkflows>[] = [
  {
    accessorKey: "crons",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cron" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-row items-center gap-4 pl-4">
        {row.original.cron}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "readable",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Readable" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-row items-center gap-4 pl-4">
        (runs {CronPrettifier.toString(row.original.cron).toLowerCase()} UTC)
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "Workflow",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Workflow" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-row items-center gap-4 pl-4">
        <div className="cursor-pointer hover:underline min-w-fit whitespace-nowrap">
          <Link href={`/workflows/${row.original.workflowId}`}>
            {row.original.workflowName}
          </Link>
        </div>
      </div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  // {
  //   accessorKey: 'Metadata',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Metadata" />
  //   ),
  //   cell: ({ row }) => {
  //     if (!row.original.additionalMetadata) {
  //       return <div></div>;
  //     }

  //     return <AdditionalMetadata metadata={row.original.additionalMetadata} />;
  //   },
  //   enableSorting: false,
  // },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-row items-center gap-4 pl-4">
        <RelativeDate date={row.original.metadata.createdAt} />
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
];
