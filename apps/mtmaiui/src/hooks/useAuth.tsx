"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  tenantMembershipsListOptions,
  userGetCurrentOptions,
  userUpdateLoginMutation,
} from "mtmaiapi";
import { setCookie } from "mtxuilib/lib/clientlib";
import { useEffect, useMemo, useState } from "react";
import { useMtmaiV2 } from "../stores/StoreProvider";

export const useUser = () => {
  const userQuery = useQuery({
    ...userGetCurrentOptions(),
  });
  return userQuery.data;
};
export const useTenant = () => {
  return useMtmaiV2((x) => x.currentTenant);
};

export const useTenantId = () => {
  return useMtmaiV2((x) => x.currentTenant?.metadata.id) as string;
};

export const useIsAdmin = () => {
  const tenant = useTenant();
  return ["default", "admin", "Default"].includes(tenant?.name || "");
};

export const useLoginHandler = () => {
  // const router = useMtRouter();
  const frontendConfig = useMtmaiV2((x) => x.frontendConfig);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const cookieKey = frontendConfig?.cookieAccessToken || "access_token";
  // const loginMutation = useMtmMutation(MtmService.method.login, {
  //   onSuccess: (data) => {
  //     console.log("login success", data);
  //     if (data.accessToken) {
  //       setCookie(cookieKey, data.accessToken);
  //       router.push("/");
  //     }
  //   },
  // });
  const login = useMutation({
    ...userUpdateLoginMutation(),
    onSuccess: (data) => {
      console.log("login success", data);
      if (data.userToken) {
        setCookie(cookieKey, data.userToken);
        // router.push("/");
      }
    },
  });
  const loginHandler = async (values) => {
    login.mutate({
      // username: values.email,
      // password: values.password,
      body: {
        email: values.email,
        password: values.password,
      },
    });
  };

  return { loginHandler, isPending: login.isPending, fieldErrors };
};

/**
 * 基本数据的加载
 * @param props
 * @returns
 */
export function useSessionLoader() {
  // const nav = Route.useNavigate();
  const currentTenant = useMtmaiV2((x) => x.currentTenant);
  const setCurrentTenant = useMtmaiV2((x) => x.setCurrentTenant);
  const lastTenant = useMtmaiV2((x) => x.lastTenant);

  const listMembershipsQuery = useQuery({
    ...tenantMembershipsListOptions(),
  });

  const memberships = useMemo(() => {
    return listMembershipsQuery.data?.rows || [];
  }, [listMembershipsQuery]);

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

    if (listMembershipsQuery.isFetched && memberships?.length === 0) {
      // 如果没有任何租户，则创建一个默认租户
      // const tenant = await api.tenantCreate({
      //   name: "Default",
      //   slug: "default",
      // });
      // return tenant.data;
      // nav({
      //   to: "/onboarding/create-tenant",
      // });
    }
    return memberships?.[0]?.tenant;
  }, [memberships, lastTenant?.metadata.id]);

  useEffect(() => {
    if (computedCurrTenant && !currentTenant) {
      setCurrentTenant(computedCurrTenant);
    }
  }, [computedCurrTenant, currentTenant, setCurrentTenant]);

  return null;
}
