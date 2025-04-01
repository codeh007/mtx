"use client";

import type { TeamRun } from "mtmaiapi";
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

export const FlowTenantFields = (props: PropsWithChildren) => {
  const form = useFormContext<TeamRun>();

  return (
    <>
      <FormField
        control={form.control}
        name="team_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>team_name</FormLabel>
            <FormControl>
              <Input placeholder="team_name" {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
