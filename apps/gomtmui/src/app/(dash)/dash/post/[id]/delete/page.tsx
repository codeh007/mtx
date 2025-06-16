"use client";

import { useTenantId } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import type { ApiErrors } from "mtmaiapi";
import { postGetOptions } from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import { Button } from "mtxuilib/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "mtxuilib/ui/card";
import { Alert, AlertDescription } from "mtxuilib/ui/alert";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function DeletePostPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const tid = useTenantId();
  const [errors, setErrors] = useState<ApiErrors | null>(null);
  const postId = params.id as string;

  const { data: post, isLoading } = useQuery({
    ...postGetOptions({
      path: {
        tenant: tid,
        post: postId,
      },
    }),
    enabled: !!tid && !!postId,
  });
  // TODO: 后端暂时不支持删除操作，需要实现 postDeleteMutation API
  function handleDelete() {
    toast({
      title: "功能暂未开放",
      description: "文章删除功能正在开发中，请稍后再试",
      variant: "destructive",
    });
  }

  if (isLoading) {
    return <div className="p-6">加载中...</div>;
  }

  if (!post) {
    return <div className="p-6">文章不存在</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          删除功能正在开发中，暂时无法删除文章。
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertCircle className="mr-2" />
            确认删除
          </CardTitle>
          <CardDescription>您确定要删除以下文章吗？此操作无法撤销。</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="font-semibold">标题：</span>
              {post.title}
            </div>
            <div>
              <span className="font-semibold">创建时间：</span>
              {new Date(post.metadata.createdAt).toLocaleString()}
            </div>
          </div>

          {errors?.errors?.map((err) => (
            <div key={err.field} className="mt-4 text-sm text-red-500">
              {err.description}
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/dash/post")}>
            返回列表
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled
          >
            确认删除（开发中）
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
