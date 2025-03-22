"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { useFormContext } from "react-hook-form";
import { ModelSelect } from "../../../../../components/model/model-select";

export const AgentForm = () => {
  const form = useFormContext();
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
        name="provider"
        render={({ field }) => (
          <FormItem>
            <FormLabel>provider</FormLabel>
            <FormControl>
              <Input placeholder="provider" {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />

      <ModelSelect />
      <AgentConfigForm />
    </div>
  );
};

export const AgentConfigForm = () => {
  const form = useFormContext();
  return (
    <div className="bg-blue-100 p-2">
      <FormField
        control={form.control}
        name="config.name"
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
        name="config.description"
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
    </div>
  );
};
