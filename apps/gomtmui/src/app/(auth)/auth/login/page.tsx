"use client";

import { useMutation } from "@tanstack/react-query";
import { userUpdateLoginMutation } from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import { zUserLoginRequest } from "mtmaiapi/gomtmapi/zod.gen";
import { Icons } from "mtxuilib/icons/icons";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { Button } from "mtxuilib/ui/button";
import { Input } from "mtxuilib/ui/input";
import { Label } from "mtxuilib/ui/label";
import { useToast } from "mtxuilib/ui/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SubmitHandler } from "react-hook-form";

export default function LoginPage() {
	const router = useRouter();
	const { toast } = useToast();

	const form = useZodForm({
		schema: zUserLoginRequest,
		defaultValues: {
			email: "",
			password: "",
		},
		handleSubmit: (values) => {
			loginMutation.mutate({
				body: values,
			});
		},
	});

	const loginMutation = useMutation({
		...userUpdateLoginMutation(),
		onSuccess: () => {
			toast({
				title: "登录成功",
				description: "欢迎回来",
			});
			router.push("/dash");
		},
		onError: () => {
			toast({
				title: "登录失败",
				description: "邮箱或密码错误",
				variant: "destructive",
			});
		},
	});

	const handleSubmit: SubmitHandler<{
		email: string;
		password: string;
	}> = (values) => {
		loginMutation.mutate({
			body: values,
		});
	};

	return (
		<div className="mx-auto max-w-md w-full">
			<div className="prose mb-4">用户登录</div>
			<ZForm {...form} className="space-y-4" handleSubmit={handleSubmit}>
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
						disabled={loginMutation.isPending}
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="password">密码</Label>
					<Input
						{...form.form.register("password")}
						id="password"
						placeholder="请输入密码"
						type="password"
						disabled={loginMutation.isPending}
					/>
				</div>
				<Button
					type="submit"
					className="w-full"
					disabled={loginMutation.isPending}
				>
					{loginMutation.isPending && (
						<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
					)}
					登录
				</Button>
				<Button type="button" className="w-full" variant={"ghost"}>
					没有账号？ <Link href={"/auth/register"}>注册</Link>
				</Button>
			</ZForm>
			<footer className="py-3">
				<div className="prose text-center">
					© Mtm ltd. {new Date().getFullYear()}
				</div>
			</footer>
		</div>
	);
}
