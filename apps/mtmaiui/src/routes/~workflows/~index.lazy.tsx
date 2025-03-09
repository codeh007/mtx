import { createLazyFileRoute } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { useTenant } from "../../hooks/useAuth";
import { WorkflowTable } from "./components/workflow-table";

export const Route = createLazyFileRoute("/workflows/")({
  component: RouteComponent,
});

function RouteComponent() {
  const tenant = useTenant();
  if (!tenant) {
    return <>tenant not found</>;
  }
  return (
    <>
      <MtSuspenseBoundary>
        <WorkflowTable tenant={tenant} />
      </MtSuspenseBoundary>
    </>
  );
}
