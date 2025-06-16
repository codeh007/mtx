"use client";

import { useTenantId } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { proxyListOptions } from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import type { Proxy as ProxyType } from "mtmaiapi/gomtmapi/types.gen";
import { formatDate } from "mtxuilib/lib/utils";
import { Badge } from "mtxuilib/ui/badge";
import { Button } from "mtxuilib/ui/button";
import { Separator } from "mtxuilib/ui/separator";
import { DataTable } from "mtxuilib/data-table/data-table";
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

  // 分页状态管理
  const pagination = {
    pageIndex,
    pageSize,
  };

  const setPagination = (updater: any) => {
    if (typeof updater === "function") {
      const newPagination = updater(pagination);
      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    } else {
      setPageIndex(updater.pageIndex);
      setPageSize(updater.pageSize);
    }
  };

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
        <Badge variant={row.original.enabled ? "successful" : "failed"}>
          {row.original.enabled ? "启用" : "禁用"}
        </Badge>
      ),
    },
    {
      accessorKey: "lastUsedAt",
      header: "最后使用时间",
      cell: ({ row }) => (
        <div>{row.original.lastUsedAt ? formatDate(row.original.lastUsedAt) : "未使用"}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "创建时间",
      cell: ({ row }) => <div>{formatDate(row.original.createdAt || 0)}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => <ProxyActions proxy={row.original} onSuccess={refetch} />,
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
        <h1 className="text-2xl font-bold">代理服务器</h1>
        <Button onClick={() => router.push("/dash/proxy/new")}>
          <Plus className="mr-2 h-4 w-4" />
          添加代理
        </Button>
      </div>
      <Separator className="my-4" />

      <DataTable
        columns={columns}
        data={data?.rows || []}
        isLoading={isLoading}
        error={error}
        filters={[]}
        pagination={pagination}
        setPagination={setPagination}
        pageCount={data?.pagination?.num_pages || 0}
        onSetPageSize={(size) => setPageSize(size)}
        getRowId={(row) => row.id}
        emptyState={
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">暂无代理服务器</p>
            <Button onClick={() => router.push("/dash/proxy/new")}>
              <Plus className="mr-2 h-4 w-4" />
              添加第一个代理
            </Button>
          </div>
        }
      />
    </div>
  );
}
