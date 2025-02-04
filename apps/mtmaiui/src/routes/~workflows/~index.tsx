import { createFileRoute } from "@tanstack/react-router";
import { useTenant } from "../../hooks/useAuth";
import { WorkflowTable } from "./components/workflow-table";

export const Route = createFileRoute("/workflows/")({
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
