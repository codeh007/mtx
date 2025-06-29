"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
import type { Post } from "mtmaiapi/gomtmapi/types.gen";
import { Badge } from "mtxuilib/ui/badge";
import { Button } from "mtxuilib/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "mtxuilib/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export const Columns: ColumnDef<Post>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        标题
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium max-w-[200px] truncate" title={row.original.title}>
        {row.original.title}
      </div>
    ),
  },
  {
    accessorKey: "slug",
    header: "短链接",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground max-w-[150px] truncate" title={row.original.slug}>
        {row.original.slug}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "状态",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={status === "published" ? "default" : "secondary"}>
          {status === "published" ? "已发布" : "草稿"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "metadata.created_at",
    header: "创建时间",
    cell: ({ row }) => {
      const date = new Date(row.original.metadata.created_at);
      return (
        <div title={date.toLocaleString()}>
          {formatDistanceToNow(date, { addSuffix: true, locale: zhCN })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const post = row.original;
      const router = useRouter();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">打开菜单</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/dash/post/${post.metadata.id}`)}>
              <Pencil className="mr-2 h-4 w-4" />
              编辑
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/dash/post/${post.metadata.id}/delete`)}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
