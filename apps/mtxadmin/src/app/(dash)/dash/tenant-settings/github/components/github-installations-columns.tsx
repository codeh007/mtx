"use client";
import { GearIcon } from "@radix-ui/react-icons";
import type { ColumnDef } from "@tanstack/react-table";
import type { GithubAppInstallation } from "mtmaiapi/api/generated/cloud/data-contracts";
import { DataTableColumnHeader } from "mtxuilib/data-table/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "mtxuilib/ui/avatar";
import { Button } from "mtxuilib/ui/button";

export const columns = (): ColumnDef<GithubAppInstallation>[] => {
  return [
    {
      accessorKey: "repository",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Account name" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex flex-row gap-4 items-center">
            <Avatar className="w-6 h-6">
              <AvatarImage src={row.original.account_avatar_url} />
              <AvatarFallback />
            </Avatar>
            <div>{row.original.account_name}</div>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "settings",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Settings" />
      ),
      cell: ({ row }) => {
        return (
          <a
            href={row.original.installation_settings_url}
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="ghost" className="flex flex-row gap-2 px-2">
              <GearIcon className="h-4 w-4" />
              Configure
            </Button>
          </a>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];
};
