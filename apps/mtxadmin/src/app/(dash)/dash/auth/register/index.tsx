"use client";
import { useMutation } from "@tanstack/react-query";
import api, { type UserRegisterRequest } from "mtmaiapi/api";
import Link from "next/link";
import React, { useState } from "react";
import { UserRegisterForm } from "./components/user-register-form";
import { useErrorParam, useApiMeta, useApiError } from "mtmaiui/hooks/useApi";
import { MtLoading } from "mtxuilib/mt/mtloading";
import { GoogleLogin, GithubLogin, OrContinueWith } from "../login";
export default function Register() {
  useErrorParam();
  const meta = useApiMeta();

  if (meta.isLoading) {
    return <MtLoading />;
  }

  const schemes = meta.data?.auth?.schemes || [];
  const basicEnabled = schemes.includes("basic");
  const googleEnabled = schemes.includes("google");
  const githubEnabled = schemes.includes("github");

  let prompt = "Create an account to get started.";

  if (basicEnabled && (googleEnabled || githubEnabled)) {
    prompt =
      "Enter your email and password to create an account, or continue with a supported provider.";
  } else if (googleEnabled || githubEnabled) {
    prompt = "Continue with a supported provider.";
  } else if (basicEnabled) {
    prompt = "Create an account to get started.";
  } else {
    prompt = "No login methods are enabled.";
  }

  const forms = [
    basicEnabled && <BasicRegister />,
    googleEnabled && <GoogleLogin />,
    githubEnabled && <GithubLogin />,
  ].filter(Boolean);

  return (
    <div className="flex flex-1 flex-col items-center justify-center w-full h-full lg:flex-row">
      <div className="container relative flex-col items-center justify-center w-full lg:px-0">
        <div className="mx-auto flex w-full max-w-md lg:p-8">
          <div className="flex w-full flex-col justify-center space-y-6">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
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
                Already have an account?{" "}
                <Link
                  to="/auth/login"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Log in
                </Link>
              </p>
            </div>
            <p className="text-left text-sm text-gray-700 dark:text-gray-300 w-full">
              By clicking continue, you agree to our{" "}
              <Link
                to="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
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

function BasicRegister() {
  // const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { handleApiError } = useApiError({
    setFieldErrors: setFieldErrors,
  });

  const createMutation = useMutation({
    mutationKey: ["user:create"],
    mutationFn: async (data: UserRegisterRequest) => {
      await api.userCreate(data);
    },
    onSuccess: () => {
      navigate("/");
    },
    onError: handleApiError,
  });

  return (
    <UserRegisterForm
      isLoading={createMutation.isPending}
      onSubmit={createMutation.mutate}
      fieldErrors={fieldErrors}
    />
  );
}
