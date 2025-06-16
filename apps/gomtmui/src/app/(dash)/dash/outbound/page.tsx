"use client";

import { useToast } from "@/hooks/useToast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash } from "lucide-react";
import {
  singboxDeleteOutboundMutation,
  singboxGetOutboundsOptions,
} from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import type { ApiErrors } from "mtmaiapi/gomtmapi/types.gen";
import { Badge } from "mtxuilib/ui/badge";
import { Button } from "mtxuilib/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "mtxuilib/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "mtxuilib/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "mtxuilib/ui/table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OutboundsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOutboundId, setSelectedOutboundId] = useState<string | null>(null);
  const [deleteErrors, setDeleteErrors] = useState<ApiErrors | null>(null);

  // 获取所有出站代理配置
  const { data, isLoading, error } = useQuery({
    ...singboxGetOutboundsOptions(),
  });

  // 删除出站代理配置
  const deleteMutation = useMutation({
    ...singboxDeleteOutboundMutation(),
    onError: (err: any) => {
      setDeleteErrors(err);
      toast({
        title: "删除失败",
        description: "无法删除出站代理配置",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "删除成功",
        description: "已成功删除出站代理配置",
      });
      setDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["singbox", "outbounds"] });
    },
  });

  // 处理删除操作
  const handleDelete = (id: string) => {
    setSelectedOutboundId(id);
    setDeleteDialogOpen(true);
  };

  // 确认删除
  const confirmDelete = () => {
    if (selectedOutboundId) {
      deleteMutation.mutate({
        path: { id: selectedOutboundId },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-500 rounded-md">加载出站代理配置失败</div>;
  }

  return (
    <div className="space-y-4 p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">出站代理配置管理</h2>
        <Button onClick={() => router.push("/dash/outbound/new")}>
          <Plus className="mr-2 h-4 w-4" /> 新增代理
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>出站代理列表</CardTitle>
          <CardDescription>管理系统中的所有出站代理配置</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>出站代理配置列表</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>服务器地址</TableHead>
                <TableHead>端口</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.outbounds?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    暂无数据
                  </TableCell>
                </TableRow>
              ) : (
                data?.outbounds?.map((outbound) => (
                  <TableRow key={outbound.id}>
                    <TableCell className="font-medium">
                      <Link href={`/dash/outbound/${outbound.id}`} className="hover:underline">
                        {outbound.tag}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{outbound.type}</Badge>
                    </TableCell>
                    <TableCell>{outbound.server}</TableCell>
                    <TableCell>{outbound.server_port}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(outbound.id!)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>您确定要删除这个出站代理配置吗？此操作无法撤销。</DialogDescription>
          </DialogHeader>
          {deleteErrors && (
            <div className="bg-red-50 p-3 rounded-md text-sm text-red-600">
              {deleteErrors.errors?.map((err) => (
                <div key={err.field}>{err.description}</div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
