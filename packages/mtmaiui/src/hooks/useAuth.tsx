"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { userGetCurrentOptions, userUpdateLoginMutation } from "mtmaiapi";
import { useMtRouter } from "mtxuilib/hooks/use-router";
import { setCookie } from "mtxuilib/lib/clientlib";
import { useState } from "react";
import { useMtmaiV2 } from "../stores/StoreProvider";
import { useApiError } from "./useApi";

export const useUser = () => {
  const userQuery = useQuery({
    ...userGetCurrentOptions(),
  });
  return userQuery.data;
};
export const useTenant = () => {
  const tenant = useMtmaiV2((x) => x.currentTenant);
  // if (!tenant) {
  //   throw new Error("Tenant not found");
  // }
  return tenant;
};

export const useOptionalTenant = () => {
  return useMtmaiV2((x) => x.currentTenant);
};

export const useIsAdmin = () => {
  const tenant = useTenant();
  return ["default", "admin", "Default"].includes(tenant?.name || "");
};

export const useLoginHandler = () => {
  const router = useMtRouter();
  const frontendConfig = useMtmaiV2((x) => x.frontendConfig);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { handleApiError } = useApiError({ setFieldErrors });

  const cookieKey = frontendConfig!.cookieAccessToken || "access_token";
  const loginMutation = useMutation({
    ...userUpdateLoginMutation(),
    onSuccess: (data) => {
      console.log("login success", data);
      if (data.userToken) {
        setCookie(cookieKey, data.userToken);
        router.push("/");
      }
    },
    onError: handleApiError,
  });

  const loginHandler = async (values) => {
    const loginResult = await loginMutation.mutateAsync({
      body: {
        email: values.email,
        password: values.password,
      },
    });
  };

  return { loginHandler, isPending: loginMutation.isPending, fieldErrors };
};
