"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import type { Workflow } from "mtmaiapi";
import { workflowGetOptions } from "mtmaiapi";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { buttonVariants } from "mtxuilib/ui/button";
import { useState } from "react";

import { TriggerWorkflowForm } from "./components/trigger-workflow-form";

interface WorkflowTriggerBtnProps {
  workflow: Workflow;
}
export const WorkflowTriggerBtn = ({ workflow }: WorkflowTriggerBtnProps) => {
  const [triggerWorkflow, setTriggerWorkflow] = useState(false);
  const workflowQuery = useSuspenseQuery({
    ...workflowGetOptions({
      path: {
        workflow: workflow.metadata.id,
      },
    }),
  });

  const workflowName = workflowQuery.data?.name;

  return (
    <>
      <CustomLink
        to={`/trigger/${workflowName}?${new URLSearchParams({ workflowId: workflow.metadata.id }).toString()}`}
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        Trigger
      </CustomLink>

      <TriggerWorkflowForm
        show={triggerWorkflow}
        workflow={workflow}
        onClose={() => setTriggerWorkflow(false)}
      />
    </>
  );
};
