"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
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
import { useTenantId } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
	postCreateMutation,
	siteListOptions,
} from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import type { ApiErrors } from "mtmaiapi/gomtmapi/types.gen";
import { zCreatePostRequest } from "mtmaiapi/gomtmapi/zod.gen";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function CreatePostPage() {
	const router = useRouter();
	const { toast } = useToast();
	const tid = useTenantId();
	const [errors, setErrors] = useState<ApiErrors | null>(null);

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

	const form = useForm({
		resolver: zodResolver(zCreatePostRequest),
		defaultValues: {
			title: "",
			content: "",
			slug: "",
			siteId: "",
			status: "DRAFT",
		},
	});

	const createPostMutation = useMutation({
		...postCreateMutation({
			path: {
				tenant: tid,
			},
		}),
		onError: setErrors,
		onSuccess: () => {
			toast({
				title: "文章创建成功",
				description: "已成功创建新文章",
			});
			router.push("/dash/post");
		},
	});

	function onSubmit(data: any) {
		createPostMutation.mutate({
			body: data,
		});
	}

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<h1 className="text-2xl font-bold mb-6">创建新文章</h1>

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
						name="siteId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>站点</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="选择站点" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{sites.map((site) => (
											<SelectItem key={site.id} value={site.id}>
												{site.title}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
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
									<Textarea
										placeholder="请输入文章内容"
										className="min-h-[200px]"
										{...field}
									/>
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
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
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
						<Button
							type="button"
							variant="outline"
							onClick={() => router.push("/dash/post")}
						>
							取消
						</Button>
						<Button type="submit" disabled={createPostMutation.isPending}>
							{createPostMutation.isPending ? "创建中..." : "创建文章"}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
