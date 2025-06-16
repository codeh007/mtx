"use client";

import { DataTable } from "@/components/data-table";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { useTenantId } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { siteListOptions } from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import { Badge } from "mtxuilib/ui/badge";
import { Button } from "mtxuilib/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "mtxuilib/ui/card";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { PageContainer } from "../components/PageContainer";
import { columns } from "./components/site-columns";

export default function SitePage() {
  const router = useRouter();
  const { toast } = useToast();
  const tid = useTenantId();

  const { data, isLoading, error } = useQuery({
    ...siteListOptions({
      path: {
        tenant: tid,
      },
    }),
    enabled: !!tid,
  });

  const siteData =
    data?.rows?.map((site) => ({
      id: site.id,
      title: site.title,
      description: site.description || "",
      status: site.enabled ? (
        <Badge className="bg-green-500">启用</Badge>
      ) : (
        <Badge variant="outline">禁用</Badge>
      ),
      automationEnabled: site.automation_enabled ? (
        <Badge className="bg-blue-500">自动化开启</Badge>
      ) : (
        <Badge variant="outline">手动模式</Badge>
      ),
      createdAt: new Date(site.created_at).toLocaleString(),
    })) || [];

  return (
    <PageContainer
      title="站点管理"
      description="管理您的站点配置"
      actions={
        <Button onClick={() => router.push("/dash/site/create")}>
          <PlusIcon className="mr-2 h-4 w-4" />
          创建站点
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>站点列表</CardTitle>
          <CardDescription>管理所有站点</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoadingSkeleton />}>
            {isLoading ? (
              <LoadingSkeleton />
            ) : error ? (
              <div className="text-red-500">加载错误: {error.message}</div>
            ) : (
              <DataTable columns={columns} data={siteData} />
            )}
          </Suspense>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
