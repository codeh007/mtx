import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { WorkbrenchProvider } from "../../stores/workbrench.store";
import { WorkflowsProvider } from "../../stores/workflow-store";
import { RootAppWrapper } from "../components/RootAppWrapper";
import { NavWorkflow } from "../~workflows/siderbar";

export const Route = createLazyFileRoute("/instagram")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <WorkbrenchProvider>
      <WorkflowsProvider>
        <RootAppWrapper secondSidebar={<NavWorkflow />}>
          <DashHeaders>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>IG(过时)</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </DashHeaders>
          <Outlet />
        </RootAppWrapper>
      </WorkflowsProvider>
    </WorkbrenchProvider>
  );
}
