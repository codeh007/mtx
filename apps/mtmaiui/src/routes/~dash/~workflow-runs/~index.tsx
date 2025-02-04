"use client";
import { createFileRoute } from "@tanstack/react-router";
import { WorkflowRunsTable } from "../../../components/workflow-run/workflow-runs-table";
import { useTenant } from "../../../hooks/useAuth";
// import { useBasePath } from "../../../hooks/useBasePath";

export const Route = createFileRoute("/dash/workflow-runs/")({
  component: RouteComponent,
});

function RouteComponent() {
  // const basePath = useBasePath();
  const tenant = useTenant();
  if (!tenant) {
    return <div>require tenant</div>;
  }
  return (
    <>
      <WorkflowRunsTable tenant={tenant} showMetrics={true} />
    </>
  );
}
