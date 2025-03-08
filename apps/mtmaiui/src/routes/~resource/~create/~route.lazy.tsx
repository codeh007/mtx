"use client";
import { useMutation } from "@tanstack/react-query";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { platformAccountCreateMutation } from "mtmaiapi";
import { zPlatformAccount } from "mtmaiapi/gomtmapi/zod.gen";
import { useZodForm } from "mtxuilib/mt/form/ZodForm";
import { useTenantId } from "../../../hooks/useAuth";

export const Route = createLazyFileRoute("/resource/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const createPlatformAccountMutation = useMutation({
    ...platformAccountCreateMutation(),
  });
  const tid = useTenantId();
  const form = useZodForm({
    schema: zPlatformAccount,
    defaultValues: {},
  });
  return (
    <div className="flex flex-col h-full w-full px-2">
      <h1>创建资源</h1>
      <Outlet />
    </div>
  );
}
