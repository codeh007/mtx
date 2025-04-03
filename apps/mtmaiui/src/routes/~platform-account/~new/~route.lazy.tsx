"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLazyFileRoute, Outlet } from "@tanstack/react-router";
import {
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
import { PlatformAccountHeader } from "./headers";

export const Route = createLazyFileRoute("/platform-account/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const nav = useNav();
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
    defaultValues: {},
    toastValidateError: true,
    handleSubmit: (values) => {
      createPlatformAccountMutation.mutate({
        path: {
          tenant: tid,
        },
        body: {
          ...values,
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
        <FormField
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
        />
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
      </ZForm>
      <ZFormToolbar form={form.form} />
      <Outlet />
    </>
  );
}
