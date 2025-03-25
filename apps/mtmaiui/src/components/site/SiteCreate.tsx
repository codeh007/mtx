"use client";

import { useMutation } from "@tanstack/react-query";
import { type Site, siteCreateMutation } from "mtmaiapi";

import { ZFormToolbar } from "mtxuilib/mt/form/EditFormToolbar";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { useTenant } from "../../hooks/useAuth";

interface SiteCreateViewProps {
  onCancel?: () => void;
  onSuccess?: (data: Site) => void;
}
export const SiteCreateView = (props: SiteCreateViewProps) => {
  const { onCancel, onSuccess } = props;
  const tenant = useTenant();
  const form = useZodForm({
    defaultValues: {},
  });

  const createSiteMutation = useMutation({
    ...siteCreateMutation(),
    onSuccess: (data) => {
      onSuccess?.(data);
    },
  });
  const handleSubmit = async (data) => {
    createSiteMutation.mutate({
      body: data,
      path: {
        tenant: tenant!.metadata.id,
      },
    });
  };
  return (
    <ZForm
      form={form}
      handleSubmit={handleSubmit}
      className="flex flex-col space-y-2 px-2"
    >
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>title</FormLabel>
            <FormControl>
              <Input placeholder="title" {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="host"
        render={({ field }) => <Input placeholder="host" {...field} />}
      />
      <ZFormToolbar form={form} onCancel={onCancel} />
    </ZForm>
  );
};
