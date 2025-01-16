"use client";
import { ZForm, useZodForm } from "mtxuilib/form/ZodForm";
import { useMtRouter } from "mtxuilib/hooks/use-router";
import { MtLink } from "mtxuilib/mt/mtlink";
import { SubmitButton } from "mtxuilib/mt/submit-button";
import { Input } from "mtxuilib/ui/input";
import { useState } from "react";
import { z } from "zod";
import { useLoginHandler } from "../../hooks/useAuth";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// interface LoginWithCreddentsProps {
//   className?: string;
//   onSubmit: (opts: z.infer<typeof schema>) => void;
//   isLoading: boolean;
//   fieldErrors?: Record<string, string>;
// }

export function LoginWithCreddents() {
  const [isSuccessful, setIsSuccessful] = useState(false);

  const router = useMtRouter();

  const form = useZodForm({
    schema: schema,
    defaultValues: {},
  });
  // 参考
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<z.infer<typeof schema>>({
  //   resolver: zodResolver(schema),
  // });

  const { loginHandler, isPending } = useLoginHandler();
  return (
    <div className="mx-auto max-w-md w-full">
      <div className="prose text-center">账号密码登录</div>
      <ZForm form={form} className="space-y-2" handleSubmit={loginHandler}>
        <Input type="email" placeholder="邮箱" {...form.register("email")} />
        <Input
          type="password"
          placeholder="密码"
          {...form.register("password")}
        />
        <div className="flex items-center justify-between" />
        <SubmitButton
          isSuccessful={isSuccessful}
          className="w-full"
          pending={isPending}
        >
          登录
        </SubmitButton>
      </ZForm>

      <p className="px-8 text-center text-sm ">
        <MtLink
          variant={"ghost"}
          className="hover:text-brand underline mt-8"
          href={"/auth/register"}
        >
          {/* Don&apos;t have an account? Sign Up */}
          没有账号？ 注册一个
        </MtLink>
      </p>
      <footer className="py-3">
        <div className="prose text-center">
          © Mtmai. {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
