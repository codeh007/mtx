"use client";

import { useTenantId } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
	siteGetOptions,
	siteUpdateMutation,
} from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import type { ApiErrors } from "mtmaiapi/gomtmapi/types.gen";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { LoadingSkeleton } from "@/components/loading-skeleton";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SiteDetailPage({ params }: { params: { id: string } }) {
	const router = useRouter();
	const { toast } = useToast();
	const tid = useTenantId();
	const [errors, setErrors] = useState<ApiErrors | null>(null);

	const { data: siteData, isLoading } = useQuery({
		...siteGetOptions({
			path: {
				tenant: tid,
				site: params.id,
			},
		}),
		enabled: !!tid && !!params.id,
	});

	const updateSchema = z.object({
		title: z.string().min(1, "站点名称不能为空"),
	});

	const form = useForm<z.infer<typeof updateSchema>>({
		resolver: zodResolver(updateSchema),
		defaultValues: {
			title: "",
		},
		values: {
			title: siteData?.title || "",
		},
	});

	const updateSiteMutation = useMutation({
		...siteUpdateMutation({
			path: {
				tenant: tid,
				site: params.id,
			},
		}),
		onError: setErrors,
		onSuccess: () => {
			toast({
				title: "站点更新成功",
				description: "站点信息已成功更新",
			});
		},
	});

	function onSubmit(data: z.infer<typeof updateSchema>) {
		updateSiteMutation.mutate({
			path: {
				tenant: tid,
				site: params.id,
			},
			body: data,
		});
	}

	if (isLoading) {
		return <LoadingSkeleton />;
	}

	if (!siteData) {
		return <div className="text-center py-8">站点不存在或加载失败</div>;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold">站点详情</h2>
					<p className="text-muted-foreground">管理站点 {siteData.title}</p>
				</div>
				<Button variant="outline" onClick={() => router.push("/dash/site")}>
					返回列表
				</Button>
			</div>

			<Tabs defaultValue="general" className="w-full">
				<TabsList>
					<TabsTrigger value="general">基本信息</TabsTrigger>
					<TabsTrigger value="hosts">域名管理</TabsTrigger>
					<TabsTrigger value="settings">高级设置</TabsTrigger>
				</TabsList>
				<TabsContent value="general">
					<Card>
						<CardHeader>
							<CardTitle>基本信息</CardTitle>
							<CardDescription>修改站点的基本信息</CardDescription>
						</CardHeader>
						<CardContent>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-6"
								>
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

									<div className="flex items-center space-x-2">
										<Switch
											id="enabled"
											checked={siteData.enabled}
											// onChange={handleStatusChange}
											disabled
										/>
										<label htmlFor="enabled">站点状态</label>
										<span className="text-sm text-muted-foreground">
											{siteData.enabled ? "已启用" : "已禁用"}
										</span>
									</div>

									<div className="flex items-center space-x-2">
										<Switch
											id="automation"
											checked={siteData.automation_enabled}
											// onChange={handleAutomationChange}
											disabled
										/>
										<label htmlFor="automation">自动化设置</label>
										<span className="text-sm text-muted-foreground">
											{siteData.automation_enabled
												? "自动化已启用"
												: "手动模式"}
										</span>
									</div>

									{errors?.errors?.map((err) => (
										<div key={err.field} className="text-sm text-red-500">
											{err.description}
										</div>
									))}

									<div className="flex justify-end">
										<Button
											type="submit"
											disabled={
												updateSiteMutation.isPending || !form.formState.isDirty
											}
										>
											{updateSiteMutation.isPending ? "保存中..." : "保存更改"}
										</Button>
									</div>
								</form>
							</Form>
						</CardContent>
						<CardFooter className="border-t bg-muted/50 flex justify-between">
							<div className="text-xs text-muted-foreground">
								创建时间: {new Date(siteData.created_at).toLocaleString()}
							</div>
							<div className="text-xs text-muted-foreground">
								最后更新: {new Date(siteData.updated_at).toLocaleString()}
							</div>
						</CardFooter>
					</Card>
				</TabsContent>
				<TabsContent value="hosts">
					<Card>
						<CardHeader>
							<CardTitle>域名管理</CardTitle>
							<CardDescription>管理站点绑定的域名</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="text-center py-6 text-muted-foreground">
								域名管理功能暂未实现
							</div>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="settings">
					<Card>
						<CardHeader>
							<CardTitle>高级设置</CardTitle>
							<CardDescription>管理站点高级设置</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="text-center py-6 text-muted-foreground">
								高级设置功能暂未实现
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
