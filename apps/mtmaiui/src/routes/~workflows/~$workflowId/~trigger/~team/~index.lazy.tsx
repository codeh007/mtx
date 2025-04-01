import { createLazyFileRoute } from "@tanstack/react-router";
import { FlowNames } from "mtmaiapi";
import FlowForm from "../../../../../components/flow-form/FlowForm";
import { FlowTenantFields } from "../../../../../components/flow-form/flow-forms/FlowTenantFields";

export const Route = createLazyFileRoute(
  "/workflows/$workflowId/trigger/team/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  //   const workflowRunCreate = useWorkbenchStore(
  //     (state) => state.workflowRunCreate,
  //   );
  //   const handleClick = async () => {
  //     workflowRunCreate(
  //       FlowNames.TEAM,
  //       {
  //         content: "你好",
  //         topic: "default",
  //         source: "web",
  //       },
  //       {
  //         componentId: "123",
  //       },
  //     );
  //   };

  return (
    <div>
      <FlowForm workflowName={FlowNames.TEAM}>
        <FlowTenantFields />
      </FlowForm>
      {/* <Button onClick={handleClick}>运行</Button> */}
    </div>
  );
}
