"use client";
import { createFileRoute } from "@tanstack/react-router";
import { WorkflowRunsTable } from "../../components/workflow-run/workflow-runs-table";
import { useTenant } from "../../hooks/useAuth";

export const Route = createFileRoute("/workflow-runs/")({
  component: RouteComponent,
});

function RouteComponent() {
  const tenant = useTenant();
  return (
    <>
      <WorkflowRunsTable tenant={tenant!} showMetrics={true} />
    </>
  );
}
