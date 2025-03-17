import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { ComponentDndProvider } from "../../../stores/ComponentDndProvider";
import { TeamBuilderProvider } from "../../../stores/teamBuildStore";
import { WorkbrenchProvider } from "../../../stores/workbrench.store";
import { RootAppWrapper } from "../../components/RootAppWrapper";
import { NavComsWithLibrary } from "./siderbar";

export const Route = createLazyFileRoute("/coms/$comId")({
  component: RouteComponent,
  pendingComponent: (a) => <div>Loading...{JSON.stringify(a, null, 2)}</div>,
});

function RouteComponent() {
  const { comId } = Route.useParams();

  return (
    <WorkbrenchProvider>
      <TeamBuilderProvider componentId={comId}>
        <ComponentDndProvider>
          <RootAppWrapper secondSidebar={<NavComsWithLibrary />}>
            <MtSuspenseBoundary>
              <Outlet />
            </MtSuspenseBoundary>
          </RootAppWrapper>
        </ComponentDndProvider>
      </TeamBuilderProvider>
    </WorkbrenchProvider>
  );
}
