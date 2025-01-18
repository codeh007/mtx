"use client";

import { useQuery } from "@tanstack/react-query";
import { tenantMembershipsListOptions } from "mtmaiapi";
import { type PropsWithChildren, useEffect, useMemo } from "react";
import { useBasePath } from "../hooks/useBasePath";
import { Route } from "../routes/__root";
import { useMtmaiV2 } from "../stores/StoreProvider";

/**
 * 完成最基本数据的加载
 * @param props
 * @returns
 */
export function HatchatLoader(props: PropsWithChildren) {
  const { children } = props;
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

  return <>{currentTenant ? children : <div>Loading tenant...</div>}</>;
}
