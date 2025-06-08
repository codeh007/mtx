import { RootAppWrapper } from "@mtmaiui/components/RootAppWrapper";
import { WorkbrenchProvider } from "@mtmaiui/stores/workbrench.store";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
// import { NavWorkflow } from "../~workflows/siderbar";

export const Route = createLazyFileRoute("/singbox")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      fffffffffffffffffffffffffssgg
      <WorkbrenchProvider>
        <RootAppWrapper>
          {/* <DashHeaders>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>工作流</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DashHeaders> */}
          <Outlet />
        </RootAppWrapper>
      </WorkbrenchProvider>
    </>
  );
}
