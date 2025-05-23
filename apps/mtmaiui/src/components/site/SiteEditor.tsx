"use client";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { type Site, siteGetOptions, siteUpdateMutation } from "mtmaiapi";
import { Switch } from "mtxuilib/ui/switch";

import { Icons } from "mtxuilib/icons/icons";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { Button } from "mtxuilib/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "mtxuilib/ui/tooltip";
import { Suspense } from "react";
import { toast } from "sonner";
import { useTenantId } from "../../hooks/useAuth";

interface SiteEditorProps {
  siteId: string;
}
export const SiteEditor = ({ siteId }: SiteEditorProps) => {
  if (!siteId) {
    throw new Error("siteId is required");
  }
  // const tenant = useTenant();
  const tid = useTenantId();
  const siteQuery = useSuspenseQuery({
    ...siteGetOptions({
      path: {
        site: siteId,
        tenant: tid,
      },
    }),
  });
  return (
    <Suspense fallback={<div>loading from...</div>}>
      {/* <DebugValue data={{ data: siteQuery.data }} /> */}
      <SiteEditorForm site={siteQuery.data} />
    </Suspense>
  );
};

const SiteEditorForm = (props: { site: Site }) => {
  const { site } = props;
  // const tenant = useTenant();
  const tid = useTenantId();
  const updateSiteMutation = useMutation({
    ...siteUpdateMutation(),
    onSuccess: (data) => {
      toast.success("操作成功");
    },
    onError: (error) => {
      console.log(error);
      toast.error("操作失败");
    },
  });
  const form = useZodForm({
    defaultValues: site,
  });

  const handleSubmit = (data: Site) => {
    updateSiteMutation.mutate({
      path: {
        tenant: tid,
        site: site.id,
      },
      body: data,
    });
  };
  return (
    <>
      <ZForm form={form} handleSubmit={handleSubmit} className="flex flex-col space-y-2 px-2">
        <div className="flex justify-end p-2 gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button disabled={updateSiteMutation.isPending}>
                {updateSiteMutation.isPending ? (
                  <Icons.reload className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                保存
              </Button>
            </TooltipTrigger>
            <TooltipContent>保存</TooltipContent>
          </Tooltip>
        </div>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>标题</FormLabel>
              <FormControl>
                <Input placeholder="标题" {...field} />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>描述</FormLabel>
              <FormControl>
                <Input placeholder="描述" {...field} />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="enabledAutoGenArticle"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-xs">
              <div className="space-y-0.5">
                <FormLabel>自动生产文章</FormLabel>
                <FormDescription>开通后，会根据站点内容自动生成文章</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  // disabled
                  aria-readonly
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex flex-row items-center justify-between">
          <Button>发送site任务</Button>
        </div>
      </ZForm>
    </>
  );
};
