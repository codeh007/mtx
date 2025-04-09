"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import {
  FlowNames,
  type FlowPlatformAccountLoginInput,
  platformAccountCreateMutation,
  platformAccountListOptions,
} from "mtmaiapi";
import { zPlatformAccountCreate } from "mtmaiapi/gomtmapi/zod.gen";
import { ZForm, ZFormToolbar, useZodFormV2 } from "mtxuilib/mt/form/ZodForm";
import { TagsInput } from "mtxuilib/mt/inputs/TagsInput";
import { Button } from "mtxuilib/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { Switch } from "mtxuilib/ui/switch";
import { useToast } from "mtxuilib/ui/use-toast";
import { useTenantId } from "../../../hooks/useAuth";
import { useNav } from "../../../hooks/useNav";
import { useWorkflowRun } from "../../../hooks/useWorkflowRun";
import { PlatformAccountHeader } from "./headers";

export const Route = createLazyFileRoute("/platform-account/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const nav = useNav();

  const { handleRun, workflowRunData, workflowRunMutation } = useWorkflowRun(
    FlowNames.PLATFORM_ACCOUNT_LOGIN,
    {},
  );

  const createPlatformAccountMutation = useMutation({
    ...platformAccountCreateMutation(),
    onSuccess: (item) => {
      queryClient.invalidateQueries({
        ...platformAccountListOptions({
          path: {
            tenant: tid,
          },
        }),
      });
      toast.toast({
        title: "创建成功",
        description: (
          <div>
            <Button
              onClick={() => {
                nav({ to: `/platform-account/${item.metadata?.id}` });
              }}
            >
              查看
            </Button>
          </div>
        ),
      });
    },
  });
  const tid = useTenantId();
  const form = useZodFormV2({
    schema: zPlatformAccountCreate,
    defaultValues: {
      platform: "instagram",
      username: "saibichquyenll2015",
      // password: "",
      enabled: true,
      state: {
        proxy_url: "http://localhost:10809",
      },
    },
    toastValidateError: true,
    handleSubmit: async (values) => {
      const result = await createPlatformAccountMutation.mutateAsync({
        path: {
          tenant: tid,
        },
        body: {
          ...values,
        },
      });
      workflowRunMutation.mutate({
        path: {
          workflow: FlowNames.PLATFORM_ACCOUNT_LOGIN,
        },
        body: {
          input: {
            platform_account_id: result.metadata?.id,
            action: "login",
            // platform_name: values.platform,
            // username: values.username,
            // password: values.password,
            // proxy_url: (values.state as any).proxy_url,
          } satisfies FlowPlatformAccountLoginInput,
        },
      });
    },
  });
  return (
    <>
      <PlatformAccountHeader />
      <ZForm {...form} className="flex flex-col h-full w-full px-2 space-y-2">
        <FormField
          control={form.form.control}
          name="platform"
          render={({ field }) => (
            <FormItem>
              <FormLabel>platform</FormLabel>
              <FormControl>
                <Input {...field} placeholder="platform" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="username" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} placeholder="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>type</FormLabel>
              <FormControl>
                <Input {...field} placeholder="type" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder="email" type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>tags</FormLabel>
              <FormControl>
                <TagsInput {...field} placeholder="tags" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name={"enabled"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>enabled</FormLabel>
              <FormControl>
                <Switch
                  checked={!!field.value}
                  onCheckedChange={(checked) => {
                    form.form.setValue("enabled", checked);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.form.control}
          name="state.proxy_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>代理地址</FormLabel>
              <FormControl>
                <Input {...field} placeholder="代理地址" />
              </FormControl>
            </FormItem>
          )}
        />
      </ZForm>
      <ZFormToolbar form={form.form} />
      <Outlet />
    </>
  );
}
