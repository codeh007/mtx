import { createLazyFileRoute } from "@tanstack/react-router";
import { FlowAgFields } from "../../../../../components/flow-form/flow-forms/FlowAgFields";

export const Route = createLazyFileRoute("/workflows/$workflowId/trigger/ag/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <FlowAgFields />
    </>
  );
}
