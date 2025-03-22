import { createLazyFileRoute } from "@tanstack/react-router";
import { AgentForm } from "../AgentForm";

export const Route = createLazyFileRoute(
  "/coms/$comId/team_builder/agent/$agentId/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { agentId } = Route.useParams();
  return (
    <>
      <AgentForm />
    </>
  );
}
