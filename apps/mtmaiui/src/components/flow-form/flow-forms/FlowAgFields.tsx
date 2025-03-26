"use client";

import type { zAgentRunInput } from "mtmaiapi/gomtmapi/zod.gen";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import type { PropsWithChildren } from "react";
import { useFormContext } from "react-hook-form";
import type { z } from "zod";

export const FlowAgFields = (props: PropsWithChildren) => {
  const form = useFormContext<z.infer<typeof zAgentRunInput>>();

  return (
    <>
      <FormField
        control={form.control}
        name="teamName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>teamName</FormLabel>
            <FormControl>
              <Input placeholder="somevalue" {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
