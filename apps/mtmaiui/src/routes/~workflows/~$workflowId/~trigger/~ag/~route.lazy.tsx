"use client";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { FlowNames } from "mtmaiapi";
import FlowForm from "../../../../../components/flow-form/FlowForm";

export const Route = createLazyFileRoute("/workflows/$workflowId/trigger/ag")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <FlowForm workflowName={FlowNames.AG} className="flex flex-col gap-4">
      <Outlet />
    </FlowForm>
  );
}
