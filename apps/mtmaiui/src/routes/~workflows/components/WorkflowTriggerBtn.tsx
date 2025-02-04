"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { workflowGetOptions } from "mtmaiapi";
import { cn } from "mtxuilib/lib/utils";
import { buttonVariants } from "mtxuilib/ui/button";
import { useState } from "react";
import { CustomLink } from "../../../components/CustomLink";
import { TriggerWorkflowForm } from "./trigger-workflow-form";

interface WorkflowTriggerBtnProps {
  workflowId: string;
}
export const WorkflowTriggerBtn = ({ workflowId }: WorkflowTriggerBtnProps) => {
  const [triggerWorkflow, setTriggerWorkflow] = useState(false);
  // const basePath = useBasePath();
  const workflowQuery = useSuspenseQuery({
    ...workflowGetOptions({
      path: {
        workflow: workflowId,
      },
    }),
  });

  const workflowName = workflowQuery.data?.name;

  return (
    <>
      <CustomLink
        to={`/workflows/trigger/${workflowName}?${new URLSearchParams({ workflowId }).toString()}`}
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        Trigger
      </CustomLink>

      <TriggerWorkflowForm
        show={triggerWorkflow}
        workflow={workflowQuery.data}
        onClose={() => setTriggerWorkflow(false)}
      />
    </>
  );
};
