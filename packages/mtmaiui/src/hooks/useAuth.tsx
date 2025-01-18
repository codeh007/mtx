"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  tenantMembershipsListOptions,
  userGetCurrentOptions,
  userUpdateLoginMutation,
} from "mtmaiapi";
import { useMtRouter } from "mtxuilib/hooks/use-router";
import { setCookie } from "mtxuilib/lib/clientlib";
import { useEffect, useMemo, useState } from "react";
// import { Route } from "@tanstack/react-router";
import { Route } from "../routes/__root";
import { useMtmaiV2 } from "../stores/StoreProvider";
import { useApiError } from "./useApi";

import { useBasePath } from "./useBasePath";

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

/**
 * 基本数据的加载
 * @param props
 * @returns
 */
export function useSessionLoader() {
  const currentTenant = useMtmaiV2((x) => x.currentTenant);
  const setCurrentTenant = useMtmaiV2((x) => x.setCurrentTenant);
  const lastTenant = useMtmaiV2((x) => x.lastTenant);

  const basePath = useBasePath();
  const listMembershipsQuery = useQuery({
    ...tenantMembershipsListOptions(),
  });

  const memberships = useMemo(() => {
    return listMembershipsQuery.data?.rows || [];
  }, [listMembershipsQuery]);

  const navigate = Route.useNavigate();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const computedCurrTenant = useMemo(() => {
    const findTenant = (tenantId: string) => {
      return memberships?.find((m) => m.tenant?.metadata.id === tenantId)
        ?.tenant;
    };

    // const currTenantId = searchParams.get("tenant") || undefined;

    // if (currTenantId) {
    //   const tenant = findTenant(currTenantId);

    //   if (tenant) {
    //     return tenant;
    //   }
    // }

    const lastTenantId = lastTenant?.metadata.id || undefined;

    if (lastTenantId) {
      const tenant = findTenant(lastTenantId);

      if (tenant) {
        return tenant;
      }
    }

    if (memberships?.length === 0) {
      // 如果没有任何租户，则创建一个默认租户
      // const tenant = await api.tenantCreate({
      //   name: "Default",
      //   slug: "default",
      // });
      // return tenant.data;

      navigate({
        to: `${basePath}/onboarding/create-tenant`,
      });
    }
    const firstMembershipTenant = memberships?.[0]?.tenant;

    return firstMembershipTenant;
  }, [basePath, memberships, lastTenant?.metadata.id]);

  useEffect(() => {
    // 当computedCurrTenant有值，且currentTenant没有值时，设置currentTenant
    if (computedCurrTenant && !currentTenant) {
      setCurrentTenant(computedCurrTenant);
    }
  }, [computedCurrTenant, currentTenant, setCurrentTenant]);

  return null;
}
