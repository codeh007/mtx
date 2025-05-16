import { RootAppWrapper } from "@mtmaiui/components/RootAppWrapper";
import { WorkbrenchProvider } from "@mtmaiui/stores/workbrench.store";
import { WorkflowsProvider } from "@mtmaiui/stores/workflow-store";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { NavAdkSession } from "../~adk/~session/siderbar";

export const Route = createLazyFileRoute("/mttask")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <WorkbrenchProvider>
        <WorkflowsProvider>
          <RootAppWrapper secondSidebar={<NavAdkSession />}>
            {/* <DashHeaders>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>Adk会话</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </DashHeaders> */}
            <Outlet />
          </RootAppWrapper>
        </WorkflowsProvider>
      </WorkbrenchProvider>
    </>
  );
}
