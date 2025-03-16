import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { ComponentDndProvider } from "../../../stores/ComponentDndProvider";
import { TeamBuilderProvider } from "../../../stores/teamBuildStore";
import { WorkbrenchProvider } from "../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/coms/$comId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { comId } = Route.useParams();

  return (
    <WorkbrenchProvider>
      <TeamBuilderProvider componentId={comId}>
        <ComponentDndProvider>
          <Outlet />
        </ComponentDndProvider>
      </TeamBuilderProvider>
    </WorkbrenchProvider>
  );
}
