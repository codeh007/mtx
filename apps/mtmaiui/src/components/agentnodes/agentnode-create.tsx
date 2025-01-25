"use client";

import { useMutation } from "@tanstack/react-query";
import { agentNodeRunMutation } from "mtmaiapi";
import { EditFormToolbar } from "mtxuilib/mt/form/EditFormToolbar";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form.jsx";
import { Input } from "mtxuilib/ui/input";
import { z } from "zod";
import { useTenant } from "../../hooks/useAuth";

export const AgentNodeCreateView = () => {
  const tenant = useTenant();
  const form = useZodForm({
    schema: z.object({
      title: z.string().optional(),
      prompt: z.string().min(10),
    }),
    defaultValues: {},
  });

  const createMutation = useMutation({
    ...agentNodeRunMutation(),
  });
  const workflowName = "research";
  const handleFormSubmit = (values) => {
    createMutation.mutate({
      path: {
        tenant: tenant.metadata.id,
      },
      body: {
        payload: {
          ...values,
        },
        flowName: workflowName,
        nodeId: "123",
        isStream: false,
      },
    });
  };
  return (
    <>
      <ZForm
        form={form}
        handleSubmit={handleFormSubmit}
        className="flex flex-col space-y-2 px-2"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>网址</FormLabel>
              <FormControl>
                <Input placeholder="网址" {...field} />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>提示词</FormLabel>
              <FormControl>
                <Input placeholder="提示词" {...field} />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <EditFormToolbar form={form} />
      </ZForm>
    </>
  );
};
