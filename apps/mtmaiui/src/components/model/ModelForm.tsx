"use client";

import type { zUpsertModel } from "mtmaiapi/gomtmapi/zod.gen";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { useFormContext } from "react-hook-form";
import type { z } from "zod";

export const ModelClientForm = () => {
  const form = useFormContext<z.infer<typeof zUpsertModel>>();
  return (
    <div className=" p-2">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>name</FormLabel>
            <FormControl>
              <Input placeholder="name" {...field} />
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
            <FormLabel>description</FormLabel>
            <FormControl>
              <Input placeholder="description" {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="apiKey"
        render={({ field }) => (
          <FormItem>
            <FormLabel>apiKey</FormLabel>
            <FormControl>
              <Input placeholder="apiKey" {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="apiBase"
        render={({ field }) => (
          <FormItem>
            <FormLabel>apiBase</FormLabel>
            <FormControl>
              <Input placeholder="apiBase" {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
