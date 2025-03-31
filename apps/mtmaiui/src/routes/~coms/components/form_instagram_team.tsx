"use client";

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

export const FormInstagramTeam = () => {
  const form = useFormContext();

  useEffect(() => {
    form.setValue(
      "component.provider",
      "mtmai.teams.instagram_team.instagram_team.InstagramTeam",
    );
    form.setValue("component.config", {
      max_turns: 10,
    });
  }, [form]);
  return (
    <div>
      <h1>instagram 团队配置</h1>
      <div className="flex flex-col h-full w-full px-2">
        {/* <ZForm
          form={form}
          handleSubmit={(values) => {
            createBrowserMutation.mutate({
              path: {
                tenant: tid,
              },
              body: {
                ...values,
              },
            });
          }}
          className="space-y-2"
        > */}
        {/* <FormField
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
        /> */}

        <FormField
          control={form.control}
          name="component.config.title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>任务</FormLabel>
              <FormControl>
                <Input {...field} placeholder="任务" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="component.config.max_turns"
          render={({ field }) => (
            <FormItem>
              <FormLabel>轮次限制</FormLabel>
              <FormControl>
                <Input {...field} type="number" placeholder="轮次限制" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
