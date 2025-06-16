"use client";

import { useTenantId } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  pAccountGetOptions,
  pAccountUpdateMutation,
} from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import { zPAccountCreate } from "mtmaiapi/gomtmapi/zod.gen";
import { Button } from "mtxuilib/ui/button";
import { Checkbox } from "mtxuilib/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { Textarea } from "mtxuilib/ui/textarea";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

export default function EditPAccountPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const tid = useTenantId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const accountId = params.id;

  // 使用 zPAccountCreate 模式验证表单
  const form = useForm<z.infer<typeof zPAccountCreate>>({
    resolver: zodResolver(zPAccountCreate),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      platform: "",
      enabled: true,
      name: "",
      description: "",
      type: "",
    },
  });

  // 更新账号的 mutation
  const updateAccountMutation = useMutation({
    ...pAccountUpdateMutation(),
    onSuccess: () => {
      toast.success("账号更新成功");
      router.push("/dash/p_account");
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      toast.error(`更新失败: ${errorMessage}`);
      setIsSubmitting(false);
    },
  });

  // 获取账号详情
  const {
    data: account,
    isLoading,
    error,
  } = useQuery({
    ...pAccountGetOptions({
      path: {
        tenant: tid,
        accountId: accountId,
      },
    }),
    enabled: !!tid && !!accountId,
  });

  // 当获取到账号数据时，填充表单
  useEffect(() => {
    if (account) {
      form.reset({
        username: account.username || "",
        password: account.password || "",
        email: account.email || "",
        platform: account.platform || "",
        enabled: account.enabled || true,
        name: account.name || "",
        description: account.description || "",
        type: account.type || "",
      });
    }
  }, [account, form]);

  if (isLoading) {
    return <div className="container mx-auto py-6">加载中...</div>;
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    return <div className="container mx-auto py-6">加载出错: {errorMessage}</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">编辑账号</h1>
        <Button variant="outline" onClick={() => router.back()}>
          返回
        </Button>
      </div>

      <div className="space-y-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              setIsSubmitting(true);
              updateAccountMutation.mutate({
                path: {
                  tenant: tid,
                  accountId: accountId,
                },
                body: data,
              });
            })}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>平台名称 *</FormLabel>
                    <FormControl>
                      <Input placeholder="例如: Twitter, Facebook..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>显示名称</FormLabel>
                    <FormControl>
                      <Input placeholder="账号显示名称" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>用户名 *</FormLabel>
                    <FormControl>
                      <Input placeholder="平台用户名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码 *</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="账号密码" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>邮箱 *</FormLabel>
                    <FormControl>
                      <Input placeholder="账号邮箱" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>账号类型</FormLabel>
                    <FormControl>
                      <Input placeholder="账号类型" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Textarea placeholder="账号描述" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>启用账号</FormLabel>
                    <FormDescription>如果禁用，此账号将不会被系统使用</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                {isSubmitting ? "提交中..." : "保存更改"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
