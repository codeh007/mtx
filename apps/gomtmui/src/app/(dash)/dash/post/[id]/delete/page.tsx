"use client";

import { useTenantId } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// 自定义删除 mutation，因为 OpenAPI 文档中没有定义 DELETE 接口
const createPostDeleteMutation = (tid: string, postId: string) => {
  return {
    mutationFn: async () => {
      const response = await fetch(`/api/v1/tenants/${tid}/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "删除失败");
      }

      return response.json();
    },
  };
};

export default function DeletePostPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const tid = useTenantId();
  const queryClient = useQueryClient();
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

  const deletePostMutation = useMutation({
    ...createPostDeleteMutation(tid, postId),
    onError: (error: Error) => {
      setErrors({ errors: [{ field: "general", description: error.message }] });
      toast({
        title: "删除失败",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      // 刷新缓存
      queryClient.invalidateQueries({ queryKey: ["postList"] });

      toast({
        title: "文章删除成功",
        description: "已成功删除文章",
      });
      router.push("/dash/post");
    },
  });

  function handleDelete() {
    deletePostMutation.mutate();
  }

  if (isLoading) {
    return <div className="p-6">加载中...</div>;
  }

  if (!post) {
    return <div className="p-6">文章不存在</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto">
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
              {new Date(post.metadata.created_at).toLocaleString()}
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
            取消
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deletePostMutation.isPending}
          >
            {deletePostMutation.isPending ? "删除中..." : "确认删除"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
