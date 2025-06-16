"use client";

import { useToast } from "@/hooks/useToast";
import { useMutation } from "@tanstack/react-query";
import type { ApiErrors } from "mtmaiapi";
import { userCreateMutation } from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import { zUserRegisterRequest } from "mtmaiapi/gomtmapi/zod.gen";
import { Icons } from "mtxuilib/icons/icons";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { Button } from "mtxuilib/ui/button";
import { Input } from "mtxuilib/ui/input";
import { Label } from "mtxuilib/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";

export default function RegisterPage() {
	const router = useRouter();
	const toast = useToast();

	const [errors, setErrors] = useState<ApiErrors | null>(null);

	const form = useZodForm({
		schema: zUserRegisterRequest,
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
		handleSubmit: (values) => {
			registerMutation.mutate({
				body: values,
			});
		},
	});

	const registerMutation = useMutation({
		...userCreateMutation(),
		onError: setErrors,
		onSuccess: () => {
			toast({
				title: "注册成功",
				description: "请登录您的账号",
			});
			router.push("/auth/login");
		},
	});

	const handleSubmit: SubmitHandler<{
		name: string;
		email: string;
		password: string;
	}> = (values) => {
		registerMutation.mutate({
			body: values,
		});
	};

	return (
		<div className="mx-auto max-w-md w-full">
			<div className="prose mb-4">注册新用户</div>
			<ZForm {...form} className="space-y-4" handleSubmit={handleSubmit}>
				<div className="grid gap-2">
					<Label htmlFor="name">姓名</Label>
					<Input
						{...form.form.register("name")}
						id="name"
						placeholder="请输入姓名"
						type="text"
						autoComplete="name"
						disabled={registerMutation.isPending}
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="email">邮箱</Label>
					<Input
						{...form.form.register("email")}
						id="email"
						placeholder="name@example.com"
						type="email"
						autoCapitalize="none"
						autoComplete="email"
						autoCorrect="off"
						disabled={registerMutation.isPending}
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="password">密码</Label>
					<Input
						{...form.form.register("password")}
						id="password"
						placeholder="请输入密码"
						type="password"
						disabled={registerMutation.isPending}
					/>
				</div>
				<Button
					type="submit"
					className="w-full"
					disabled={registerMutation.isPending}
				>
					{registerMutation.isPending && (
						<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
					)}
					注册
				</Button>
				<Button type="button" className="w-full" variant={"ghost"}>
					已有账号？ <Link href={"/auth/login"}>登录</Link>
				</Button>
			</ZForm>
			{errors?.errors?.map((err) => (
				<div key={err.field} className="text-sm text-red-500">
					{err.description}
				</div>
			))}
			<footer className="py-3">
				<div className="prose text-center">
					© Mtm ltd. {new Date().getFullYear()}
				</div>
			</footer>
		</div>
	);
}
