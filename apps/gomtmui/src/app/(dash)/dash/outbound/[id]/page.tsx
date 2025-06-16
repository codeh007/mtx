"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Loader2, Trash } from "lucide-react";
import {
  singboxGetOutboundOptions,
  singboxDeleteOutboundMutation
} from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import type { ApiErrors } from "mtmaiapi/gomtmapi/types.gen";
import { Badge } from "mtxuilib/ui/badge";
import { Button } from "mtxuilib/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "mtxuilib/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "mtxuilib/ui/dialog";
import { useToast } from "mtxuilib/ui/use-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function OutboundDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const outboundId = params.id as string;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteErrors, setDeleteErrors] = useState<ApiErrors | null>(null);

  // 获取出站代理详情
  const {
    data: outbound,
    isLoading,
    error,
  } = useQuery({
    ...singboxGetOutboundOptions({
      path: { id: outboundId },
    }),
  });

  // 删除代理配置的mutation
  const deleteMutation = useMutation({
    ...singboxDeleteOutboundMutation(),
    onError: (err) => {
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
      // 刷新列表数据
      queryClient.invalidateQueries({ queryKey: ["singbox", "getOutbounds"] });
      router.push("/dash/outbound");
    },
  });

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate({
      path: { id: outboundId },
    });
    setDeleteDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-500 rounded-md">加载出站代理详情失败</div>;
  }

  if (!outbound) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-500 rounded-md">未找到指定的出站代理配置</div>
    );
  }

  return (
    <div className="space-y-4 p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">出站代理详情</h2>
        <Button variant="outline" onClick={() => router.push("/dash/outbound")}>
          返回列表
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500">标签名称</div>
              <div className="text-lg">{outbound.tag}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">代理类型</div>
              <div>
                <Badge variant="outline">{outbound.type}</Badge>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">服务器地址</div>
              <div>{outbound.server}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">服务器端口</div>
              <div>{outbound.server_port}</div>
            </div>
            {outbound.password && (
              <div>
                <div className="text-sm font-medium text-gray-500">密码</div>
                <div className="font-mono bg-gray-100 p-1 rounded">{outbound.password}</div>
              </div>
            )}
            {outbound.security && (
              <div>
                <div className="text-sm font-medium text-gray-500">安全类型</div>
                <div>{outbound.security}</div>
              </div>
            )}
            {outbound.domain_resolver && (
              <div>
                <div className="text-sm font-medium text-gray-500">域名解析器</div>
                <div>{outbound.domain_resolver}</div>
              </div>
            )}
            <div>
              <div className="text-sm font-medium text-gray-500">创建时间</div>
              <div>{new Date(outbound.created_at || "").toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">更新时间</div>
              <div>{new Date(outbound.updated_at || "").toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>完整配置</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-auto bg-gray-100 p-4 rounded-md h-[400px] text-sm font-mono">
              {JSON.stringify(outbound.full_config, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => router.push("/dash/outbound/" + outboundId + "/edit")}
        >
          <Edit className="mr-2 h-4 w-4" />
          编辑
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Trash className="mr-2 h-4 w-4" />
          )}
          删除
        </Button>
        <Button variant="outline" onClick={() => router.push("/dash/outbound")}>
          返回列表
        </Button>
      </div>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              您确定要删除出站代理配置 "{outbound?.tag}" 吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          {deleteErrors?.errors?.map((err) => (
            <div key={err.field} className="text-sm text-red-500">
              {err.description}
            </div>
          ))}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
