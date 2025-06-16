"use client";

import { useTenantId } from "@/hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import {
  pAccountDeleteMutation,
  pAccountListOptions,
} from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import { Badge } from "mtxuilib/ui/badge";
import { Button } from "mtxuilib/ui/button";
import { Input } from "mtxuilib/ui/input";
import { Pagination } from "mtxuilib/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "mtxuilib/ui/table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function PAccountPage() {
  const router = useRouter();
  const tid = useTenantId();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    ...pAccountListOptions({
      path: {
        tenant: tid,
      },
      query: {
        page: page,
        limit: limit,
      },
    }),
    enabled: !!tid,
  });

  // 删除账号的 mutation
  const deleteAccountMutation = useMutation({
    ...pAccountDeleteMutation(),
    onSuccess: () => {
      toast.success("账号删除成功");
      refetch(); // 重新获取账号列表
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      toast.error(`删除失败: ${errorMessage}`);
    },
  });

  // 处理删除账号
  const handleDelete = (accountId: string) => {
    if (confirm("确定要删除这个账号吗？此操作无法撤销。")) {
      deleteAccountMutation.mutate({
        path: {
          tenant: tid,
          accountId: accountId,
        },
      });
    }
  };

  // 处理页面变化
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 筛选账号
  const filteredAccounts = data?.rows?.filter((account) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      account.username.toLowerCase().includes(searchLower) ||
      account.email.toLowerCase().includes(searchLower) ||
      account.platform.toLowerCase().includes(searchLower) ||
      account.name?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">平台账号管理</h1>
        <Button onClick={() => router.push("/dash/p_account/create")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          新建账号
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="搜索账号..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">加载中...</div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>名称</TableHead>
                  <TableHead>平台</TableHead>
                  <TableHead>用户名</TableHead>
                  <TableHead>邮箱</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts && filteredAccounts.length > 0 ? (
                  filteredAccounts.map((account) => (
                    <TableRow key={account.metadata.id}>
                      <TableCell>{account.name || "-"}</TableCell>
                      <TableCell>{account.platform}</TableCell>
                      <TableCell>{account.username}</TableCell>
                      <TableCell>{account.email}</TableCell>
                      <TableCell>
                        <Badge variant={account.enabled ? "default" : "destructive"}>
                          {account.enabled ? "启用" : "禁用"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/dash/p_account/${account.metadata.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(account.metadata.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      没有找到账号
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {data?.pagination && (
            <div className="mt-4 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={data.pagination.num_pages || 1}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
