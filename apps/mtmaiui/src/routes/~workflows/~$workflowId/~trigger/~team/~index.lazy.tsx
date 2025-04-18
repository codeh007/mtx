import { createLazyFileRoute } from "@tanstack/react-router";
import { FlowNames } from "mtmaiapi";
import FlowForm from "../../../../../components/flow-form/FlowForm";
import { FlowTeamFields } from "../../../../../components/flow-form/flow-forms/FlowTeamFields";

export const Route = createLazyFileRoute(
  "/workflows/$workflowId/trigger/team/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <FlowForm workflowName={FlowNames.TEAM}>
        <FlowTeamFields />
      </FlowForm>
    </>
  );
}
