"use client";

import { useTenantId } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { useQuery } from "@tanstack/react-query";
import { proxyGetOptions } from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import { Separator } from "mtxuilib/ui/separator";
import { useParams } from "next/navigation";
import { ProxyForm } from "../components/proxy-form";

export default function EditProxyPage() {
  const { proxyId } = useParams<{ proxyId: string }>();
  const tid = useTenantId();
  const { toast } = useToast();

  const { data: proxy, isLoading, error } = useQuery({
    ...proxyGetOptions({
      path: {
        tenant: tid,
        proxyId,
      },
    }),
    enabled: !!tid && !!proxyId,
  });

  // 处理错误
  if (error) {
    toast({
      title: "加载失败",
      description: "无法加载代理信息",
      variant: "destructive",
    });
  }

  return (
    <div className="flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">编辑代理服务器</h1>
      </div>
      <Separator className="my-4" />
      {isLoading ? (
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500">加载代理信息失败</p>
        </div>
      ) : (
        <ProxyForm initialData={proxy} />
      )}
    </div>
  );
}
