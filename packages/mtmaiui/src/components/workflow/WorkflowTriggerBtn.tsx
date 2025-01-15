"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { workflowGetOptions } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import { useState } from "react";
import { TriggerWorkflowForm } from "./trigger-workflow-form";

interface WorkflowTriggerBtnProps {
  workflowId: string;
}
export const WorkflowTriggerBtn = ({ workflowId }: WorkflowTriggerBtnProps) => {
  const [triggerWorkflow, setTriggerWorkflow] = useState(false);

  const workflowQuery = useSuspenseQuery({
    ...workflowGetOptions({
      path: {
        workflow: workflowId,
      },
    }),
  });
  return (
    <>
      <Button className="text-sm" onClick={() => setTriggerWorkflow(true)}>
        Trigger Workflow
      </Button>

      <TriggerWorkflowForm
        show={triggerWorkflow}
        workflow={workflowQuery.data}
        onClose={() => setTriggerWorkflow(false)}
      />
    </>
  );
};
