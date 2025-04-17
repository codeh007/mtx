import type { ColumnDef } from "@tanstack/react-table";
import CronPrettifier from "cronstrue";
import type { CronWorkflows } from "mtmaiapi";
import { DataTableColumnHeader } from "mtxuilib/data-table/data-table-column-header";
import { DataTableRowActions } from "mtxuilib/data-table/data-table-row-actions";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { RelativeDate } from "mtxuilib/mt/relative-date";
import { Badge } from "mtxuilib/ui/badge";
import { AdditionalMetadata } from "../../~events/additional-metadata";

export const columns = ({
  onDeleteClick,
}: {
  onDeleteClick: (row: CronWorkflows) => void;
}): ColumnDef<CronWorkflows>[] => {
  return [
    {
      accessorKey: "crons",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cron" />
      ),
      cell: ({ row }) => (
        <div className="flex flex-row items-center gap-4 whitespace-nowrap">
          {row.original.cron}
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "readable",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => (
        <div className="flex flex-row items-center gap-4">
          Runs {CronPrettifier.toString(row.original.cron).toLowerCase()} UTC
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.method === "API" ? (
            row.original.name
          ) : (
            <Badge variant="outline">Defined in code</Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "Workflow",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Workflow" />
      ),
      cell: ({ row }) => (
        <div className="flex flex-row items-center gap-4">
          <div className="cursor-pointer hover:underline min-w-fit whitespace-nowrap">
            <CustomLink to={`/workflows/${row.original.workflowId}`}>
              {row.original.workflowName}
            </CustomLink>
          </div>
        </div>
      ),
      enableSorting: false,
      enableHiding: true,
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
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ row }) => (
        <div className="flex flex-row items-center gap-4">
          <RelativeDate date={row.original.metadata.createdAt} />
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    // {
    //   accessorKey: 'method',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Create Method" />
    //   ),
    //   cell: ({ row }) => <div>{row.original.method}</div>,
    // },
    // {
    //   accessorKey: 'enabled',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Enabled" />
    //   ),
    //   cell: ({ row }) => <div>{row.original.enabled ? 'Yes' : 'No'}</div>,
    // },
    {
      accessorKey: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actions" />
      ),
      cell: ({ row }) => (
        <div className="flex flex-row justify-center">
          <DataTableRowActions
            row={row}
            actions={[
              {
                label: "Delete",
                onClick: () => onDeleteClick(row.original),
                disabled:
                  row.original.method !== "API"
                    ? "This cron was created via the workflow code definition. Delete it from the workflow definition instead."
                    : undefined,
              },
            ]}
          />
        </div>
      ),
      enableHiding: true,
      enableSorting: false,
    },
  ];
};
