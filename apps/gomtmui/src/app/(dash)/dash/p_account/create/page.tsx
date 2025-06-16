"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTenantId } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { pAccountCreateMutation } from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import { zPAccountCreate } from "mtmaiapi/gomtmapi/zod.gen";
import { useToast } from "mtxuilib/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

export default function CreatePAccountPage() {
	const router = useRouter();
	const tid = useTenantId();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();

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

	// 创建账号的 mutation
	const createAccountMutation = useMutation({
		...pAccountCreateMutation(),
		onSuccess: () => {
			toast({
				title: "账号创建成功",
				description: "账号创建成功",
			});
			router.push("/dash/p_account");
		},
		onError: (error) => {
			const errorMessage = error instanceof Error ? error.message : "未知错误";
			toast({
				title: "账号创建失败",
				description: `创建失败: ${errorMessage}`,
			});
			setIsSubmitting(false);
		},
	});

	// 提交表单
	const onSubmit = (data: z.infer<typeof zPAccountCreate>) => {
		setIsSubmitting(true);
		createAccountMutation.mutate({
			path: {
				tenant: tid,
			},
			body: data,
		});
	};

	return (
		<div className="container mx-auto py-6">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">创建新账号</h1>
				<Button variant="outline" onClick={() => router.back()}>
					返回
				</Button>
			</div>

			<div className="space-y-6">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<FormField
								control={form.control}
								name="platform"
								render={({ field }) => (
									<FormItem>
										<FormLabel>平台名称 *</FormLabel>
										<FormControl>
											<Input
												placeholder="例如: Twitter, Facebook..."
												{...field}
											/>
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
											<Input
												type="password"
												placeholder="账号密码"
												{...field}
											/>
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
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>启用账号</FormLabel>
										<FormDescription>
											如果禁用，此账号将不会被系统使用
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>

						<div className="flex justify-end">
							<Button
								type="submit"
								disabled={isSubmitting}
								className="w-full md:w-auto"
							>
								{isSubmitting ? "提交中..." : "创建账号"}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
