"use client";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { platformAccountCreateMutation } from "mtmaiapi";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { TagsInput } from "mtxuilib/mt/inputs/TagsInput";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { z } from "zod";

export const Route = createFileRoute('/platform-account/create')({
  component: RouteComponent,
})

function RouteComponent() {
  
  const createPlatformAccountMutation = useMutation({
    ...platformAccountCreateMutation(),
  });
  const form = useZodForm({
    schema: z.any(),
    // defaultValues: post,
  });
  return (
    <>
      <ZForm
        form={form}
        handleSubmit={(values) => {
          createPlatformAccountMutation.mutate({
            // path: {
            //   tenant: tenant!.metadata.id,
            // },
            body: {
              ...values,
              // siteId: siteId,
            },
          });
        }}
        className="space-y-2"
      >
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
      </ZForm>
    </>
}
