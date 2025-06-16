"use client";

import { useTenantId } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  postGetOptions,
  siteListOptions,
} from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import type { ApiErrors } from "mtmaiapi/gomtmapi/types.gen";
import { Button } from "mtxuilib/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "mtxuilib/ui/select";
import { Textarea } from "mtxuilib/ui/textarea";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updatePostSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(50).max(10240),
  slug: z.string().min(3).max(200),
  status: z.enum(["draft", "published"]),
});

type UpdatePostData = z.infer<typeof updatePostSchema>;

// 自定义更新 mutation，因为 OpenAPI 文档中没有定义 PATCH 接口
const createPostUpdateMutation = (tid: string, postId: string) => {
  return {
    mutationFn: async (data: UpdatePostData) => {
      const response = await fetch(`/api/v1/tenants/${tid}/posts/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "更新失败");
      }

      return response.json();
    },
  };
};

export default function EditPostPage() {
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

  // 获取站点列表
  const { data: siteData } = useQuery({
    ...siteListOptions({
      path: {
        tenant: tid,
      },
    }),
    enabled: !!tid,
  });

  const sites = siteData?.rows || [];

  const form = useForm<UpdatePostData>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      title: "",
      content: "",
      slug: "",
      status: "draft",
    },
  });

  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title || "",
        content: post.content || "",
        slug: post.slug || "",
        status: post.status || "draft",
      });
    }
  }, [post, form]);

  const updatePostMutation = useMutation({
    ...createPostUpdateMutation(tid, postId),
    onError: (error: Error) => {
      setErrors({ errors: [{ field: "general", description: error.message }] });
      toast({
        title: "更新失败",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      // 刷新缓存
      queryClient.invalidateQueries({ queryKey: ["postList"] });
      queryClient.invalidateQueries({ queryKey: ["postGet"] });

      toast({
        title: "文章更新成功",
        description: "已成功更新文章内容",
      });
      router.push("/dash/post");
    },
  });

  function onSubmit(data: UpdatePostData) {
    updatePostMutation.mutate(data);
  }

  if (isLoading) {
    return <div className="p-6">加载中...</div>;
  }

  if (!post) {
    return <div className="p-6">文章不存在</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">编辑文章</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>标题</FormLabel>
                <FormControl>
                  <Input placeholder="请输入文章标题" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>短链接</FormLabel>
                <FormControl>
                  <Input placeholder="my-post-url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>内容</FormLabel>
                <FormControl>
                  <Textarea placeholder="请输入文章内容" className="min-h-[200px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>状态</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">草稿</SelectItem>
                    <SelectItem value="published">已发布</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {errors?.errors?.map((err) => (
            <div key={err.field} className="text-sm text-red-500">
              {err.description}
            </div>
          ))}

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/dash/post")}>
              取消
            </Button>
            <Button type="submit" disabled={updatePostMutation.isPending}>
              {updatePostMutation.isPending ? "更新中..." : "更新文章"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
