"use client";

import { useTenantId } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  postGetOptions,
} from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import type { ApiErrors } from "mtmaiapi/gomtmapi/types.gen";
import { Button } from "mtxuilib/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "mtxuilib/ui/select";
import { Textarea } from "mtxuilib/ui/textarea";
import { Alert, AlertDescription } from "mtxuilib/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updatePostSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(50).max(10240),
  slug: z.string().min(3).max(200),
  status: z.string(),
});

type UpdatePostData = z.infer<typeof updatePostSchema>;

export default function EditPostPage() {
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

  const form = useForm<UpdatePostData>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      title: "",
      content: "",
      slug: "",
      status: "",
    },
  });

  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title || "",
        content: post.content || "",
        slug: post.slug || "",
        status: post.status || "DRAFT",
      });
    }
  }, [post, form]);

  // TODO: 后端暂时不支持更新操作，需要实现 postUpdateMutation API
  function onSubmit(data: UpdatePostData) {
    toast({
      title: "功能暂未开放",
      description: "文章编辑功能正在开发中，请稍后再试",
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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">编辑文章</h1>

      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          编辑功能正在开发中。目前只能查看文章内容，暂时无法保存修改。
        </AlertDescription>
      </Alert>

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
                    <SelectItem value="DRAFT">草稿</SelectItem>
                    <SelectItem value="PUBLISHED">已发布</SelectItem>
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
              返回列表
            </Button>
            <Button type="submit" disabled>
              更新文章（开发中）
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
