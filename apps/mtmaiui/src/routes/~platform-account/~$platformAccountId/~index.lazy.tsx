"use client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  platformAccountGetOptions,
  platformAccountUpdateMutation,
} from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { ZForm, ZFormToolbar, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { JsonObjectInput } from "mtxuilib/mt/inputs/JsonObjectInput";
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
import { useTenantId } from "../../../hooks/useAuth";
export const Route = createLazyFileRoute(
  "/platform-account/$platformAccountId/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { platformAccountId } = Route.useParams();
  const tid = useTenantId();
  const query = useSuspenseQuery({
    ...platformAccountGetOptions({
      path: {
        tenant: tid,
        platform_account: platformAccountId,
      },
    }),
  });

  const updatePlatformAccountMutation = useMutation({
    ...platformAccountUpdateMutation(),
  });
  const form = useZodForm({
    schema: z.object({
      username: z.string().optional(),
      password: z.string().optional(),
      email: z.string().optional(),
      type: z.string().optional(),
      platform: z.string().optional(),
      tags: z.array(z.string()).optional(),
    }),
    defaultValues: query.data,
  });
  return (
    <>
      <ZForm
        form={form}
        handleSubmit={(values) => {
          const convertedValues = {
            ...values,
            tags: values.tags,
          };
          updatePlatformAccountMutation.mutate({
            path: {
              platform_account: id,
            },
            body: convertedValues,
          });
        }}
        className="space-y-2"
      >
        <FormField
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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
          name={"properties"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>properties</FormLabel>
              <FormControl>
                <JsonObjectInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DebugValue data={{ data: query.data, form: form.getValues() }} />
        <ZFormToolbar form={form} />
      </ZForm>
    </>
  );
}
