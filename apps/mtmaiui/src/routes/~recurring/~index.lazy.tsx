import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "mtxuilib/ui/button";
import { Separator } from "mtxuilib/ui/separator";
import { useState } from "react";
import { TriggerWorkflowForm } from "../~workflows/components/trigger-workflow-form";
import { CronsTable } from "./components/recurring-table";

export const Route = createLazyFileRoute("/recurring /")({
  component: RouteComponent,
});

function RouteComponent() {
  const [triggerWorkflow, setTriggerWorkflow] = useState(false);

  return (
    <div className="flex-grow h-full w-full">
      <div className="mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-2xl font-bold leading-tight text-foreground">
            Cron Jobs
          </h2>
          <Button onClick={() => setTriggerWorkflow(true)}>
            Create Cron Job
          </Button>
        </div>
        <TriggerWorkflowForm
          defaultTimingOption="cron"
          defaultWorkflow={undefined}
          show={triggerWorkflow}
          onClose={() => setTriggerWorkflow(false)}
        />
        <Separator className="my-4" />
        <CronsTable />
      </div>
    </div>
  );
}
