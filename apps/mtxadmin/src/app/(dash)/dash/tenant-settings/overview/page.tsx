"use client";
import { DashSidebar } from "mtmaiui/components/sidebar/siderbar";

import { Suspense } from "react";

import { useMutation } from "@tanstack/react-query";
import { capitalize } from "lodash";
import api, { type Tenant, type UpdateTenantRequest } from "mtmaiapi/api";
import { useApiError } from "mtmaiui/hooks/useApi";
import { useTenant } from "mtmaiui/hooks/useAuth";
import { SkeletonListview } from "mtxuilib/components/skeletons/SkeletonListView";
import { Spinner } from "mtxuilib/mt/mtloading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { Button } from "mtxuilib/ui/button";
import { Label } from "mtxuilib/ui/label";
import { Separator } from "mtxuilib/ui/separator";
import { SidebarInset, SidebarTrigger } from "mtxuilib/ui/sidebar";
import { Switch } from "mtxuilib/ui/switch";
import { useState } from "react";
import { UpdateTenantForm } from "./components/update-tenant-form";

export default function TenantSettings() {
  const tenant = useTenant();

  return (
    <>
      <DashSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Suspense fallback={<SkeletonListview />}>
            <div className="space-y-8">
              <div className="flex-grow h-full w-full">
                <div className="mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
                  <h2 className="text-2xl font-bold leading-tight text-foreground">
                    {capitalize(tenant.name)} Overview
                  </h2>
                  <Separator className="my-4" />
                  <UpdateTenant tenant={tenant} />
                  <Separator className="my-4" />
                  <AnalyticsOptOut tenant={tenant} />
                </div>
              </div>
            </div>
          </Suspense>
        </div>
      </SidebarInset>
    </>
  );
}

const UpdateTenant: React.FC<{ tenant: Tenant }> = ({ tenant }) => {
  const [isLoading, setIsLoading] = useState(false);

  const { handleApiError } = useApiError({});

  const updateMutation = useMutation({
    mutationKey: ["tenant:update"],
    mutationFn: async (data: UpdateTenantRequest) => {
      await api.tenantUpdate(tenant.metadata.id, data);
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      window.location.reload();
    },
    onError: handleApiError,
  });

  return (
    <div className="w-fit">
      <UpdateTenantForm
        isLoading={isLoading}
        onSubmit={(data) => {
          updateMutation.mutate(data);
        }}
        tenant={tenant}
      />
    </div>
  );
};

const AnalyticsOptOut: React.FC<{ tenant: Tenant }> = ({ tenant }) => {
  const checked = !!tenant.analyticsOptOut;

  const [changed, setChanged] = useState(false);
  const [checkedState, setChecked] = useState(checked);
  const [isLoading, setIsLoading] = useState(false);

  const { handleApiError } = useApiError({});

  const updateMutation = useMutation({
    mutationKey: ["tenant:update"],
    mutationFn: async (data: UpdateTenantRequest) => {
      await api.tenantUpdate(tenant.metadata.id, data);
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      window.location.reload();
    },
    onSettled: () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    },
    onError: handleApiError,
  });

  const save = () => {
    updateMutation.mutate({
      analyticsOptOut: checkedState,
    });
  };

  return (
    <>
      <h2 className="text-xl font-semibold leading-tight text-foreground">
        Analytics Opt-Out
      </h2>
      <Separator className="my-4" />
      <p className="text-gray-700 dark:text-gray-300 my-4">
        Choose whether to opt out of all analytics tracking.
      </p>
      <div className="flex items-center space-x-2">
        <Switch
          id="aoo"
          checked={checkedState}
          onClick={() => {
            setChecked((checkedState) => !checkedState);
            setChanged(true);
          }}
        />
        <Label htmlFor="aoo" className="text-sm">
          Analytics Opt-Out
        </Label>
      </div>
      {changed &&
        (isLoading ? (
          <Spinner />
        ) : (
          <Button onClick={save} className="mt-4">
            Save and Reload
          </Button>
        ))}
    </>
  );
};
