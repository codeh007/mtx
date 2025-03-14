"use client";
import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { platformAccountCreateMutation } from "mtmaiapi";
import { zPlatformAccount } from "mtmaiapi/gomtmapi/zod.gen";
import { EditFormToolbar } from "mtxuilib/mt/form/EditFormToolbar";
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
import { Switch } from "mtxuilib/ui/switch";
import { useTenantId } from "../../hooks/useAuth";

export const Route = createLazyFileRoute("/platform-account/create")({
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
      <ZForm
        form={form}
        handleSubmit={(values) => {
          createPlatformAccountMutation.mutate({
            path: {
              tenant: tid,
            },
            body: {
              ...values,
            },
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
        {/* <FormField
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
        /> */}

        <FormField
          name={"enabled"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>enabled</FormLabel>
              <FormControl>
                <Switch
                  checked={!!field.value}
                  onCheckedChange={(checked) => {
                    form.setValue("enabled", checked);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <EditFormToolbar form={form} />
      </ZForm>
    </div>
  );
}
