"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useTenantId } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { proxyListOptions } from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import type { Proxy as ProxyType } from "mtmaiapi/gomtmapi/types.gen";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProxyActions } from "./components/proxy-actions";

export default function ProxyPage() {
	const router = useRouter();
	const { toast } = useToast();
	const tid = useTenantId();
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10);

	const { data, isLoading, error, refetch } = useQuery({
		...proxyListOptions({
			path: {
				tenant: tid,
			},
			query: {
				limit: pageSize,
				offset: pageIndex * pageSize,
			},
		}),
		enabled: !!tid,
	});

	const columns: ColumnDef<ProxyType>[] = [
		{
			accessorKey: "name",
			header: "名称",
		},
		{
			accessorKey: "url",
			header: "URL",
		},
		{
			accessorKey: "type",
			header: "类型",
		},
		{
			accessorKey: "provider",
			header: "提供商",
		},
		{
			accessorKey: "enabled",
			header: "状态",
			cell: ({ row }) => (
				<Badge variant={row.original.enabled ? "success" : "destructive"}>
					{row.original.enabled ? "启用" : "禁用"}
				</Badge>
			),
		},
		{
			accessorKey: "lastUsedAt",
			header: "最后使用时间",
			cell: ({ row }) => (
				<div>
					{row.original.lastUsedAt
						? formatDate(row.original.lastUsedAt)
						: "未使用"}
				</div>
			),
		},
		{
			accessorKey: "createdAt",
			header: "创建时间",
			cell: ({ row }) => <div>{formatDate(row.original.createdAt)}</div>,
		},
		{
			id: "actions",
			cell: ({ row }) => (
				<ProxyActions proxy={row.original} onSuccess={refetch} />
			),
		},
	];

	if (error) {
		toast({
			title: "加载失败",
			description: "无法加载代理列表",
			variant: "destructive",
		});
	}

	return (
		<div className="flex-col">
			<div className="flex items-center justify-between">
				<Heading title="代理服务器" description="管理代理服务器" />
				<Button onClick={() => router.push("/dash/proxy/new")}>
					<Plus className="mr-2 h-4 w-4" />
					添加代理
				</Button>
			</div>
			<Separator className="my-4" />
			<DataTable
				columns={columns}
				data={data?.proxies || []}
				isLoading={isLoading}
				pageCount={Math.ceil((data?.proxies?.length || 0) / pageSize)}
				pageIndex={pageIndex}
				pageSize={pageSize}
				onPageIndexChange={setPageIndex}
				onPageSizeChange={setPageSize}
			/>
		</div>
	);
}
