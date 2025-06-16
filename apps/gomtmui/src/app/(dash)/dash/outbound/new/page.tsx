"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import type { ApiErrors } from "mtmaiapi";
import { singboxCreateOutboundMutation } from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import { zSbOutboundCreate } from "mtmaiapi/gomtmapi/zod.gen";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { useToast } from "mtxuilib/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewOutboundPage() {
	const router = useRouter();
	const { toast } = useToast();
	const [errors, setErrors] = useState<ApiErrors | null>(null);

	// 创建代理配置的mutation
	const createMutation = useMutation({
		...singboxCreateOutboundMutation(),
		onError: (err) => {
			setErrors(err);
			toast({
				title: "创建失败",
				description: "无法创建出站代理配置",
				variant: "destructive",
			});
		},
		onSuccess: () => {
			toast({
				title: "创建成功",
				description: "已成功创建出站代理配置",
			});
			router.push("/dash/outbound");
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
			full_config: JSON.stringify(
				{
					type: "shadowsocks",
					tag: "",
					server: "",
					server_port: 443,
					method: "2022-blake3-aes-128-gcm",
					password: "",
				},
				null,
				2,
			),
		},
		handleSubmit: (data) => {
			createMutation.mutate({
				body: data,
			});
		},
	});

	// 当基本字段变更时，同步更新full_config
	const updateFullConfig = (formData) => {
		try {
			const currentConfig = JSON.parse(form.form.getValues().full_config);
			const updatedConfig = {
				...currentConfig,
				...formData,
			};
			form.form.setValue("full_config", JSON.stringify(updatedConfig, null, 2));
		} catch (e) {
			console.error("解析配置失败", e);
		}
	};

	return (
		<div className="space-y-4 p-4 sm:p-6 lg:p-8">
			<div className="flex justify-between items-center">
				<h2 className="text-3xl font-bold tracking-tight">新建出站代理配置</h2>
				<Button variant="outline" onClick={() => router.push("/dash/outbound")}>
					返回列表
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>创建新的出站代理</CardTitle>
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
											{...field}
											className="font-mono h-64"
											placeholder="完整的JSON配置"
										/>
									</FormControl>
									<FormDescription>
										高级用户可以直接编辑完整的JSON配置
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{errors?.errors?.map((err) => (
							<div key={err.field} className="text-sm text-red-500">
								{err.description}
							</div>
						))}

						<div className="flex justify-end gap-2">
							<Button
								variant="outline"
								onClick={() => router.push("/dash/outbound")}
								type="button"
							>
								取消
							</Button>
							<Button type="submit" disabled={createMutation.isPending}>
								{createMutation.isPending ? "提交中..." : "创建代理"}
							</Button>
						</div>
					</ZForm>
				</CardContent>
			</Card>
		</div>
	);
}
