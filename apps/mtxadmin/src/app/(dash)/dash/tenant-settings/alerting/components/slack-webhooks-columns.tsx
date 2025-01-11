import type { ColumnDef } from "@tanstack/react-table";
import type { SlackWebhook } from "mtmaiapi/api";
import { DataTableColumnHeader } from "mtxuilib/data-table/data-table-column-header";
import { DataTableRowActions } from "mtxuilib/data-table/data-table-row-actions";
import { RelativeDate } from "mtxuilib/mt/relative-date";

export const columns = ({
  onDeleteClick,
}: {
  onDeleteClick: (row: SlackWebhook) => void;
}): ColumnDef<SlackWebhook>[] => {
  return [
    {
      accessorKey: "teamName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Team" />
      ),
      cell: ({ row }) => <div>{row.original.teamName}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "channelName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Channel" />
      ),
      cell: ({ row }) => <div>{row.original.channelName}</div>,
    },
    {
      accessorKey: "created",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ row }) => (
        <div>
          <RelativeDate date={row.original.metadata.createdAt} />
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          actions={[
            {
              label: "Delete",
              onClick: () => onDeleteClick(row.original),
            },
          ]}
        />
      ),
    },
  ];
};
