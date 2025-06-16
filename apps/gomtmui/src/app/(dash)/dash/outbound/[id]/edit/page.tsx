"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import type { ApiErrors } from "mtmaiapi";
import {
  singboxGetOutboundOptions,
  singboxUpdateOutboundMutation,
} from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import { zSbOutboundCreate } from "mtmaiapi/gomtmapi/zod.gen";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { Button } from "mtxuilib/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "mtxuilib/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "mtxuilib/ui/select";
import { Textarea } from "mtxuilib/ui/textarea";
import { useToast } from "mtxuilib/ui/use-toast";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditOutboundPage() {
  const router = useRouter();
  const params = useParams();
  const outboundId = params.id as string;
  const { toast } = useToast();
  const [errors, setErrors] = useState<ApiErrors | null>(null);

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

  // 更新代理配置的mutation
  const updateMutation = useMutation({
    ...singboxUpdateOutboundMutation(),
    onError: (err) => {
      setErrors(err);
      toast({
        title: "更新失败",
        description: "无法更新出站代理配置",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "更新成功",
        description: "已成功更新出站代理配置",
      });
      router.push(`/dash/outbound/${outboundId}`);
    },
  });

  // 设置表单
  const form = useZodForm({
    schema: zSbOutboundCreate,
    defaultValues: {
      tag: "",
      type: "shadowsocks",
      server: "",
      server_port: 443,
      password: "",
      security: "",
      domain_resolver: "",
      full_config: {
        type: "shadowsocks",
        tag: "",
        server: "",
        server_port: 443,
        method: "2022-blake3-aes-128-gcm",
        password: "",
      },
    },
    handleSubmit: (data) => {
      // 确保 full_config 是对象格式
      const submitData = {
        ...data,
        full_config: typeof data.full_config === 'string'
          ? JSON.parse(data.full_config)
          : data.full_config
      };
      updateMutation.mutate({
        path: { id: outboundId },
        body: submitData,
      });
    },
  });

  // 当获取到数据后，填充表单
  useEffect(() => {
    if (outbound) {
      form.form.reset({
        tag: outbound.tag || "",
        type: outbound.type || "shadowsocks",
        server: outbound.server || "",
        server_port: outbound.server_port || 443,
        password: outbound.password || "",
        security: outbound.security || "",
        domain_resolver: outbound.domain_resolver || "",
        full_config: outbound.full_config || {},
      });
    }
  }, [outbound, form.form]);

  // 当基本字段变更时，同步更新full_config
  const updateFullConfig = (formData) => {
    try {
      const currentConfig = form.form.getValues().full_config;
      const updatedConfig = {
        ...currentConfig,
        ...formData,
      };
      form.form.setValue("full_config", updatedConfig);
    } catch (e) {
      console.error("更新配置失败", e);
    }
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
        <h2 className="text-3xl font-bold tracking-tight">编辑出站代理配置</h2>
        <Button variant="outline" onClick={() => router.push(`/dash/outbound/${outboundId}`)}>
          返回详情
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>编辑出站代理</CardTitle>
        </CardHeader>
        <CardContent>
          <ZForm {...form} className="space-y-6">
            <FormField
              control={form.form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名称标签</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="请输入代理名称"
                      onChange={(e) => {
                        field.onChange(e);
                        updateFullConfig({ tag: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormDescription>代理配置的唯一标识名称</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>代理类型</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        updateFullConfig({ type: value });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择代理类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shadowsocks">Shadowsocks</SelectItem>
                        <SelectItem value="vmess">VMess</SelectItem>
                        <SelectItem value="trojan">Trojan</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>选择代理协议类型</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.form.control}
              name="server"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>服务器地址</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="服务器IP或域名"
                      onChange={(e) => {
                        field.onChange(e);
                        updateFullConfig({ server: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.form.control}
              name="server_port"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>服务器端口</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value);
                        field.onChange(value);
                        updateFullConfig({ server_port: value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>密码</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="服务器密码"
                      onChange={(e) => {
                        field.onChange(e);
                        updateFullConfig({ password: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.form.control}
              name="full_config"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>完整配置</FormLabel>
                  <FormControl>
                    <Textarea
                      value={JSON.stringify(field.value, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          field.onChange(parsed);
                        } catch (err) {
                          // 如果解析失败，暂时保存字符串值
                          field.onChange(e.target.value);
                        }
                      }}
                      className="font-mono h-64"
                      placeholder="完整的JSON配置"
                    />
                  </FormControl>
                  <FormDescription>高级用户可以直接编辑完整的JSON配置</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {errors?.errors?.map((err) => (
              <div key={err.field} className="text-sm text-red-500">
                {err.description}
              </div>
            ))}

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/dash/outbound/${outboundId}`)}
                type="button"
              >
                取消
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                更新
              </Button>
            </div>
          </ZForm>
        </CardContent>
      </Card>
    </div>
  );
}
