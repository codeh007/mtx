"use client";
import { useMutation } from "@tanstack/react-query";
import { type UserRegisterRequest, userCreateMutation } from "mtmaiapi";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { Button } from "mtxuilib/ui/button";
import { Input } from "mtxuilib/ui/input";
import Link from "next/link";
import { z } from "zod";
export function UserRegisterScreen() {
  const register = useMutation({
    ...userCreateMutation(),
  });

  const form = useZodForm({
    schema: z.any(),
    defaultValues: {},
  });

  const handleSubmit = (values: UserRegisterRequest) => {
    register.mutate({
      body: {
        ...values,
      },
    });
  };
  return (
    <div className="mx-auto max-w-md w-full">
      <div className="prose">注册新用户</div>
      <ZForm form={form} className="space-y-2" handleSubmit={handleSubmit}>
        <Input type="email" placeholder="邮箱" {...form.register("email")} />
        <Input
          type="password"
          placeholder="密码"
          {...form.register("password")}
        />
        <Input
          type="password"
          placeholder="重复密码"
          {...form.register("password-repeat")}
        />
        <div className="flex items-center justify-between" />
        <Button type="submit" className="w-full">
          注册
        </Button>

        <Button type="submit" className="w-full" variant={"ghost"}>
          已有账号？ <Link href={"/auth/login"}>登录</Link>
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
