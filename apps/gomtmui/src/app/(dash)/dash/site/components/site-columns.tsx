"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, ExternalLink, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export type SiteData = {
	id: string;
	title: string;
	description: string;
	status: React.ReactNode;
	automationEnabled: React.ReactNode;
	createdAt: string;
};

export const columns: ColumnDef<SiteData>[] = [
	{
		accessorKey: "title",
		header: "站点名称",
		cell: ({ row }) => {
			return (
				<Link
					href={`/dash/site/${row.original.id}`}
					className="font-medium hover:underline text-blue-600"
				>
					{row.getValue("title")}
				</Link>
			);
		},
	},
	{
		accessorKey: "description",
		header: "描述",
	},
	{
		accessorKey: "status",
		header: "状态",
	},
	{
		accessorKey: "automationEnabled",
		header: "自动化状态",
	},
	{
		accessorKey: "createdAt",
		header: "创建时间",
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const site = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">打开菜单</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem asChild>
							<Link href={`/dash/site/${site.id}`}>
								<Edit className="mr-2 h-4 w-4" />
								<span>编辑</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href={`/site/${site.id}`} target="_blank">
								<ExternalLink className="mr-2 h-4 w-4" />
								<span>预览</span>
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
