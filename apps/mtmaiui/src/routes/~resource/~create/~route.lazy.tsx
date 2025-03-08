"use client";
import { useMutation } from "@tanstack/react-query";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { platformAccountCreateMutation } from "mtmaiapi";
import { zPlatformAccount } from "mtmaiapi/gomtmapi/zod.gen";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { useZodForm } from "mtxuilib/mt/form/ZodForm";
import { buttonVariants } from "mtxuilib/ui/button";
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
      <div className="bg-blue-100 p-2 gap-1.5">
        <CustomLink
          className={cn(buttonVariants({ variant: "ghost" }))}
          to="res/platform_account"
        >
          平台账号
        </CustomLink>
        <CustomLink
          className={cn(buttonVariants({ variant: "ghost" }))}
          to="res/browser"
        >
          浏览器配置
        </CustomLink>
      </div>
      <Outlet />
    </div>
  );
}
