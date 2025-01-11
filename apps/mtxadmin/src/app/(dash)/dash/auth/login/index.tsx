"use client";
import { useMutation } from "@tanstack/react-query";
import api, { type UserLoginRequest } from "mtmaiapi/api";
import Link from "next/link";
import React, { useState } from "react";
import { Icons } from "react-toastify";
// import useErrorParam from "../hooks/use-error-param";
import { UserLoginForm } from "./components/user-login-form";
import { useErrorParam, useApiMeta, useApiError } from "mtmaiui/hooks/useApi";
import { useMtRouter } from "mtxuilib/hooks/use-router";
import { MtLoading } from "mtxuilib/mt/mtloading";
import { Button } from "mtxuilib/ui/button";

export default function Login() {
  useErrorParam();
  const meta = useApiMeta();

  if (meta.isLoading) {
    return <MtLoading />;
  }

  const schemes = meta.data?.auth?.schemes || [];
  const basicEnabled = schemes.includes("basic");
  const googleEnabled = schemes.includes("google");
  const githubEnabled = schemes.includes("github");

  let prompt = "Enter your email and password below.";

  if (basicEnabled && (googleEnabled || githubEnabled)) {
    prompt =
      "Enter your email and password below, or continue with a supported provider.";
  } else if (googleEnabled || githubEnabled) {
    prompt = "Continue with a supported provider.";
  } else if (basicEnabled) {
    prompt = "Enter your email and password below.";
  } else {
    prompt = "No login methods are enabled.";
  }

  const forms = [
    basicEnabled && <BasicLogin />,
    googleEnabled && <GoogleLogin />,
    githubEnabled && <GithubLogin />,
  ].filter(Boolean);

  return (
    <div className="flex flex-1 flex-col items-center justify-center w-full h-full lg:flex-row">
      <div className="container relative flex-col items-center justify-center w-full lg:px-0">
        <div className="mx-auto flex w-full max-w-md lg:p-8">
          <div className="flex w-full flex-col justify-center space-y-6">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Log in</h1>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {prompt}
              </p>
            </div>
            {forms.map((form, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <React.Fragment key={index}>
                {form}
                {index < schemes.length - 1 && <OrContinueWith />}
              </React.Fragment>
            ))}

            <div className="flex flex-col space-y-2">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Don't have an account?{" "}
                <Link
                  href="/auth/register"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign up
                </Link>
              </p>
            </div>
            <p className="text-left text-sm text-gray-700 dark:text-gray-300 w-full">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrContinueWith() {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white px-2 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          Or continue with
        </span>
      </div>
    </div>
  );
}

function BasicLogin() {
  // const navigate = useNavigate();
  const router = useMtRouter();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { handleApiError } = useApiError({ setFieldErrors });

  const loginMutation = useMutation({
    mutationKey: ["user:update:login"],
    mutationFn: async (data: UserLoginRequest) => {
      await api.userUpdateLogin(data);
    },
    onSuccess: () => {
      router.push("/");
    },
    onError: handleApiError,
  });

  return (
    <UserLoginForm
      isLoading={loginMutation.isPending}
      onSubmit={loginMutation.mutate}
      fieldErrors={fieldErrors}
    />
  );
}

export function GoogleLogin() {
  return (
    <a href="/api/v1/users/google/start" className="w-full">
      <Button variant="outline" type="button" className="w-full py-2">
        <Icons.google className="mr-2 h-4 w-4" />
        Google
      </Button>
    </a>
  );
}

export function GithubLogin() {
  return (
    <a href="/api/v1/users/github/start" className="w-full">
      <Button variant="outline" type="button" className="w-full py-2">
        <Icons.gitHub className="mr-2 h-4 w-4" />
        Github
      </Button>
    </a>
  );
}
