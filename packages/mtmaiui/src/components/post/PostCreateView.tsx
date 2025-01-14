"use client";
import { useMutation } from "@tanstack/react-query";
import { postCreateMutation } from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import type { Tenant } from "mtmaiapi/gomtmapi/types.gen";

import { ZForm, useZodForm } from "mtxuilib/form/ZodForm";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "mtxuilib/ui/tabs";
import { toast } from "sonner";
import { z } from "zod";

interface PostCreateViewProps {
  tenant: Tenant;
  siteId: string;
}
export const PostCreateView = (props: PostCreateViewProps) => {
  const { tenant } = props;
  // const { postId } = props;
  const postUpdateMutation = useMutation({
    // ...blogPostCreateMutation(),
    onSuccess: (data) => {
      toast.success("操作成功");
    },
    onError: (error) => {
      console.log("失败", error);
    },
  });

  // const postQuery = useSuspenseQuery({
  //   // ...blogPostGetOptions({
  //   //   path: {
  //   //     slug_or_id: postId || "",
  //   //   },
  //   // }),
  //   ...postGetOptions({
  //     path: {
  //       tenant: tenant.metadata.id,
  //       // post: "123",
  //     },
  //   }),
  // });

  // const post = postQuery?.data;

  const createPostMutation = useMutation({
    ...postCreateMutation(),
    onSuccess: (data) => {
      toast.success("操作成功");
    },
    onError: (error) => {
      console.log("失败", error);
    },
  });

  const form = useZodForm({
    schema: z.any(),
    // defaultValues: post,
  });
  return (
    <div>
      {/* <DebugValue data={post} /> */}
      <ZForm
        form={form}
        handleSubmit={(values) => {
          createPostMutation.mutate({
            path: {
              tenant: tenant.metadata.id,
              // site: props.siteId,
            },
            body: {
              ...values,
              siteId: props.siteId,
            },
          });
        }}
        className="space-y-2"
      >
        <Tabs defaultValue="content" className="w-full h-full">
          <TabsList className="flex w-full gap-2">
            <div className="flex flex-1">
              {/* {props.goBackOptions && (
                <div className="mr-2">
                  <MtLink href={props.goBackOptions.path}>
                    {props.goBackOptions.label}
                  </MtLink>
                </div>
              )} */}
              <TabsTrigger value="content">文章</TabsTrigger>
              <TabsTrigger value="options">选项</TabsTrigger>
            </div>
            <div>
              <Button type="submit">保存</Button>
            </div>
          </TabsList>
          <TabsContent value="content">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>标题</FormLabel>
                  <FormControl>
                    <Input {...form.register("title")} placeholder="title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
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
              control={form.control}
              name="slug"
              render={({ field }) => <Input {...field} placeholder="slug" />}
            />

            <div className="min-h-4" />
            <div className="h-full mx-auto w-full">
              <textarea
                className="w-full h-full"
                value={form.getValues().content}
                onChange={(e) => {
                  form.setValue("content", e.target.value);
                }}
              />
            </div>
          </TabsContent>
          <TabsContent value="options">not implemented</TabsContent>
        </Tabs>
      </ZForm>
    </div>
  );
};
