"use client";
import type { ColumnDef } from "@tanstack/react-table";
import type { APIToken } from "mtmaiapi/api";
import { DataTableColumnHeader } from "mtxuilib/data-table/data-table-column-header";
import { DataTableRowActions } from "mtxuilib/data-table/data-table-row-actions";
import { RelativeDate } from "mtxuilib/mt/relative-date";

export const columns = ({
  onRevokeClick,
}: {
  onRevokeClick: (row: APIToken) => void;
}): ColumnDef<APIToken>[] => {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
      enableSorting: false,
      enableHiding: false,
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
      accessorKey: "Expires",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Expires" />
      ),
      cell: ({ row }) => {
        return (
          <div>{new Date(row.original.expiresAt).toLocaleDateString()}</div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          actions={[
            {
              label: "Revoke",
              onClick: () => onRevokeClick(row.original),
            },
          ]}
        />
      ),
    },
  ];
};
