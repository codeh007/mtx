"use client";

import { useMutation } from "@tanstack/react-query";
import { type FlowNames, workflowRunCreateMutation } from "mtmaiapi";
import { ZForm, ZFormToolbar, useZodFormV2 } from "mtxuilib/mt/form/ZodForm";
import { Button } from "mtxuilib/ui/button";
import { useToast } from "mtxuilib/ui/use-toast";
import type { PropsWithChildren } from "react";
import { z } from "zod";
import { useNav } from "../../hooks/useNav";

interface FlowFormProps {
  workflowName: FlowNames;
}

export default function FlowForm({
  workflowName,
  children,
}: PropsWithChildren<FlowFormProps>) {
  const nav = useNav();
  const toast = useToast();

  const handleNavToWorkflowRun = (id: string) => {
    nav({
      to: `/workflow-runs/${id}`,
    });
  };

  const workflowRunCreate = useMutation({
    ...workflowRunCreateMutation(),
    onSuccess: (resp) => {
      toast.toast({
        title: "Workflow run created",
        description: (
          <div>
            <Button onClick={() => handleNavToWorkflowRun(resp?.metadata?.id)}>
              View Workflow
            </Button>
          </div>
        ),
      });
    },
    onError: (error) => {
      toast.toast({
        title: "操作失败",
        description: error.errors.join(","),
      });
    },
    onMutate: () => {
      toast.toast({
        title: "处理中",
        description: "触发 workflow 中",
      });
    },
  });
  const form = useZodFormV2({
    schema: z.object({
      input: z.string(),
    }),
    defaultValues: {},
    handleSubmit: (values) => {
      // console.log(values);
      workflowRunCreate.mutate({
        path: {
          workflow: workflowName,
        },
        body: {
          input: values,
        },
      });
    },
  });

  return (
    <ZForm {...form}>
      {children}
      {/* <Button
        onClick={() => {
          workflowRunCreate.mutate({
            path: {
              workflow: workflowName,
            },
            body: {
              input: form.form.getValues(),
            },
          });
        }}
      >
        运行
      </Button> */}

      <ZFormToolbar form={form.form} />
    </ZForm>
  );
}
