import type { ColumnDef } from "@tanstack/react-table";
import type { TenantAlertEmailGroup } from "mtmaiapi/api";
import { DataTableColumnHeader } from "mtxuilib/data-table/data-table-column-header";
import { DataTableRowActions } from "mtxuilib/data-table/data-table-row-actions";
import { RelativeDate } from "mtxuilib/mt/relative-date";
import { Badge } from "mtxuilib/ui/badge";

export const columns = ({
  alertTenantEmailsSet,
  onDeleteClick,
  onToggleMembersClick,
}: {
  alertTenantEmailsSet: boolean;
  onDeleteClick: (row: TenantAlertEmailGroup) => void;
  onToggleMembersClick: (val: boolean) => void;
}): ColumnDef<TenantAlertEmailGroup>[] => {
  return [
    {
      accessorKey: "emails",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Emails" />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.metadata.id == "default" && (
            <Badge className="mr-2" variant="secondary">
              All Tenant Members
            </Badge>
          )}
          {row.original.emails.map((email, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <Badge key={index} className="mr-2" variant="outline">
              {email}
            </Badge>
          ))}
        </div>
      ),
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
          {row.original.metadata.id !== "default" && (
            <RelativeDate date={row.original.metadata.createdAt} />
          )}
        </div>
      ),
    },
    {
      id: "enabled",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2 justify-end">
          {row.original.metadata.id !== "default" || alertTenantEmailsSet ? (
            <Badge variant="successful">Enabled</Badge>
          ) : (
            <Badge variant="destructive">Disabled</Badge>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2 justify-end mr-4">
          <DataTableRowActions
            row={row}
            actions={[
              row.original.metadata.id !== "default"
                ? {
                    label: "Delete",
                    onClick: () => onDeleteClick(row.original),
                  }
                : {
                    label: alertTenantEmailsSet ? "Disable" : "Enable",
                    onClick: () => onToggleMembersClick(!alertTenantEmailsSet),
                  },
            ]}
          />
        </div>
      ),
    },
  ];
};
