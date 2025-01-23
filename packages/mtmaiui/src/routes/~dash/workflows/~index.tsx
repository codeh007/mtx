import { createFileRoute } from "@tanstack/react-router";
import { WorkflowTable } from "../../../components/workflow/workflow-table";
import { useTenant } from "../../../hooks/useAuth";

export const Route = createFileRoute("/dash/workflows/")({
  component: RouteComponent,
});

function RouteComponent() {
  const tenant = useTenant();
  if (!tenant) {
    return <>tenant not found</>;
  }
  return (
    <>
      <WorkflowTable tenant={tenant} />
    </>
  );
}
