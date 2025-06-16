"use client";

import { useTenantId } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { siteCreateMutation } from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import type { ApiErrors } from "mtmaiapi/gomtmapi/types.gen";
import { zCreateSiteRequest } from "mtmaiapi/gomtmapi/zod.gen";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "mtxuilib/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "mtxuilib/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { Textarea } from "mtxuilib/ui/textarea";

export default function CreateSitePage() {
  const router = useRouter();
  const { toast } = useToast();
  const tid = useTenantId();
  const [errors, setErrors] = useState<ApiErrors | null>(null);

  const form = useForm<z.infer<typeof zCreateSiteRequest>>({
    resolver: zodResolver(zCreateSiteRequest),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const createSiteMutation = useMutation({
    ...siteCreateMutation({
      path: {
        tenant: tid,
      },
    }),
    onError: setErrors,
    onSuccess: () => {
      toast({
        title: "站点创建成功",
        description: "正在跳转到站点列表",
      });
      router.push("/dash/site");
    },
  });

  function onSubmit(data: z.infer<typeof zCreateSiteRequest>) {
    createSiteMutation.mutate({
      path: {
        tenant: tid,
      },
      body: data,
    });
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>创建新站点</CardTitle>
          <CardDescription>填写站点基本信息</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>站点名称</FormLabel>
                    <FormControl>
                      <Input placeholder="输入站点名称" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>站点描述</FormLabel>
                    <FormControl>
                      <Textarea placeholder="输入站点描述（可选）" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errors?.errors?.map((err) => (
                <div key={err.field} className="text-sm text-red-500">
                  {err.description}
                </div>
              ))}

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => router.push("/dash/site")}>
                  取消
                </Button>
                <Button type="submit" disabled={createSiteMutation.isPending}>
                  {createSiteMutation.isPending ? "创建中..." : "创建站点"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
