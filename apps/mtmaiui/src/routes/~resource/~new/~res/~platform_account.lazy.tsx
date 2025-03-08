import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { resourceUpsertMutation } from "mtmaiapi";
import { TagsInput } from "mtxuilib/mt/inputs/TagsInput";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTenantId } from "../../../../hooks/useAuth";
export const Route = createLazyFileRoute("/resource/new/res/platform_account")({
  component: RouteComponent,
});

function RouteComponent() {
  // const createPlatformAccountMutation = useMutation({
  //   ...platformAccountCreateMutation(),
  // })
  const resourceUpsert = useMutation({
    ...resourceUpsertMutation(),
  });
  const tid = useTenantId();
  // const form = useZodForm({
  //   // schema: zPlatformAccount,
  //   schema: zMtResourceUpsert,

  //   defaultValues: {},
  // });

  const form = useFormContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    form.reset();
    form.setValue("type", "platform_account");
    form.setValue("content", {
      username: "user1",
      password: "password1",
      email: "user1@example.com",
      platform: "platform1",
      tags: ["tag1", "tag2"],
    });
  }, []);

  return (
    <div className="flex flex-col h-full w-full px-2">
      {/* <PlateformAccountContentForm defaultValues={form.getValues().content} /> */}

      <h1>platform account content form</h1>
      <FormField
        control={form.control}
        name="content.username"
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
        name="content.password"
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
        control={form.control}
        name="content.email"
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
        control={form.control}
        name="content.email"
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
        name="content.platform"
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
        name="content.tags"
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

      {/* <FormField
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
      /> */}
    </div>
  );
}
