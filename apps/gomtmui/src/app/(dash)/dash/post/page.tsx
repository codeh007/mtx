"use client";

import { useTenantId } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { postListOptions } from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import { DataTable } from "mtxuilib/data-table/data-table";
import { Button } from "mtxuilib/ui/button";
import { useRouter } from "next/navigation";
import { Columns } from "./columns";

export default function PostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const tid = useTenantId();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    ...postListOptions({
      path: {
        tenant: tid,
      },
    }),
    enabled: !!tid,
  });

  const posts = data?.rows || [];

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["postList"] });
    refetch();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Button onClick={() => router.push("/dash/post/create")}>
          <Plus className="w-4 h-4 mr-2" />
          新建文章
        </Button>
      </div>

      <DataTable columns={Columns} data={posts} isLoading={isLoading} onRefresh={handleRefresh} />
    </div>
  );
}
