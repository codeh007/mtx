"use client";

import { useTenantId } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  proxyCreateMutation,
  proxyUpdateMutation,
} from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import type { Proxy as ProxyData } from "mtmaiapi/gomtmapi/types.gen";
import { Button } from "mtxuilib/ui/button";
import { Card, CardContent } from "mtxuilib/ui/card";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "mtxuilib/ui/select";
import { Switch } from "mtxuilib/ui/switch";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "名称不能为空"),
  description: z.string().optional(),
  url: z.string().min(1, "URL不能为空"),
  type: z.string().min(1, "类型不能为空"),
  provider: z.string().optional(),
  countryCode: z.string().optional(),
  port: z.number().int().positive().optional(),
  enabled: z.boolean().default(true),
});

type ProxyFormValues = z.infer<typeof formSchema>;

interface ProxyFormProps {
  initialData?: ProxyData;
}

export function ProxyForm({ initialData }: ProxyFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const tid = useTenantId();

  const form = useForm<ProxyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      url: initialData?.url || "",
      type: initialData?.type || "HTTP",
      provider: initialData?.provider || "",
      countryCode: initialData?.countryCode || "",
      port: initialData?.port || undefined,
      enabled: initialData?.enabled ?? true,
    },
  });

  const createProxyMutation = useMutation({
    ...proxyCreateMutation({
      path: {
        tenant: tid,
      },
    }),
    onSuccess: () => {
      toast({
        title: "创建成功",
        description: "代理服务器已创建",
      });
      router.push("/dash/proxy");
    },
    onError: (error) => {
      toast({
        title: "创建失败",
        description: "无法创建代理服务器",
        variant: "destructive",
      });
    },
  });

  const updateProxyMutation = useMutation({
    ...proxyUpdateMutation({
      path: {
        tenant: tid,
        proxyId: initialData?.id || "",
      },
    }),
    onSuccess: () => {
      toast({
        title: "更新成功",
        description: "代理服务器已更新",
      });
      router.push("/dash/proxy");
    },
    onError: (error) => {
      toast({
        title: "更新失败",
        description: "无法更新代理服务器",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: ProxyFormValues) => {
    if (initialData) {
      updateProxyMutation.mutate(values);
    } else {
      createProxyMutation.mutate(values);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>名称</FormLabel>
                    <FormControl>
                      <Input placeholder="代理名称" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="http://127.0.0.1:8080" {...field} />
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
                    <FormLabel>类型</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择代理类型" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="HTTP">HTTP</SelectItem>
                        <SelectItem value="HTTPS">HTTPS</SelectItem>
                        <SelectItem value="SOCKS4">SOCKS4</SelectItem>
                        <SelectItem value="SOCKS5">SOCKS5</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>提供商</FormLabel>
                    <FormControl>
                      <Input placeholder="提供商" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="countryCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>国家代码</FormLabel>
                    <FormControl>
                      <Input placeholder="US, CN, JP..." {...field} />
                    </FormControl>
                    <FormDescription>两位ISO国家代码</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>端口</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="8080"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value ? Number.parseInt(value, 10) : undefined);
                        }}
                      />
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
                    <Input placeholder="代理描述" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">启用状态</FormLabel>
                    <FormDescription>设置代理是否启用</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => router.push("/dash/proxy")}>
                取消
              </Button>
              <Button
                type="submit"
                disabled={createProxyMutation.isPending || updateProxyMutation.isPending}
              >
                {initialData ? "更新" : "创建"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
