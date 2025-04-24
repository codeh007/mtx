"use client";

import type { Part } from "mtmaiapi";
import { ZForm, ZFormToolbar, useZodFormV2 } from "mtxuilib/mt/form/ZodForm";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { z } from "zod";
import { useWorkbenchStore } from "../../../stores/workbrench.store";

interface InstagramLoginViewProps {
  part: Part;
}
export default function InstagramLoginView({ part }: InstagramLoginViewProps) {
  const handleHumanInput = useWorkbenchStore((x) => x.handleHumanInput);
  const form = useZodFormV2({
    schema: z.object({
      username: z.string().min(1),
      password: z.string().min(1),
      otp_key: z.string().optional(),
    }),
    toastValidateError: true,
    handleSubmit: () => {
      handleHumanInput({
        role: "user",
        parts: [
          {
            functionResponse: {
              id: part.functionCall!.id,
              name: part.functionCall!.name,
              response: {
                username: form.form.getValues("username"),
                password: form.form.getValues("password"),
                otp_key: form.form.getValues("otp_key"),
              },
            },
          },
        ],
      });
    },
  });
  return (
    <>
      <ZForm {...form}>
        {/* <input type="hidden" {...form.form.register("type")} /> */}
        <FormField
          control={form.form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>用户名</FormLabel>
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
              <FormLabel>密码</FormLabel>
              <FormControl>
                <Input {...field} placeholder="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.form.control}
          name="otp_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>两步验证密钥</FormLabel>
              <FormControl>
                <Input {...field} placeholder="otp_key" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </ZForm>
      <ZFormToolbar form={form.form} />
    </>
  );
}
