"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { tenantCreateMutation } from "mtmaiapi";
import { queries } from "mtmaiapi/api/queries";
import { useState } from "react";
import { useApiError } from "../../../../hooks/useApi";
import { useBasePath } from "../../../../hooks/useBasePath";
import { TenantCreateForm } from "./_components/tenant-create-form";
export const Route = createFileRoute("/dash/onboarding/create-tenant/")({
  component: RouteComponent,
});

function RouteComponent() {
  const basePath = useBasePath();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { handleApiError } = useApiError({
    setFieldErrors: setFieldErrors,
  });

  const listMembershipsQuery = useQuery({
    ...queries.user.listTenantMemberships,
  });

  const createMutation = useMutation({
    // mutationKey: ["user:update:login"],
    // mutationFn: async (data: CreateTenantRequest) => {
    //   const tenant = await api.tenantCreate(data);
    //   return tenant.data;
    // },
    ...tenantCreateMutation(),
    onSuccess: async (tenant) => {
      await listMembershipsQuery.refetch();
      window.location.href = `${basePath}/onboarding/get-started?tenant=${tenant.metadata.id}`;
    },
    onError: handleApiError,
  });

  return (
    <div className="flex flex-row flex-1 w-full h-full">
      <div className="container relative hidden flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="lg:p-8 mx-auto w-screen">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create a new tenant
              </h1>
            </div>
            <TenantCreateForm
              isLoading={createMutation.isPending}
              onSubmit={(values) => {
                createMutation.mutate({
                  body: values,
                });
              }}
              fieldErrors={fieldErrors}
            />
          </div>
        </div>
      </div>
    </div>
  );
}