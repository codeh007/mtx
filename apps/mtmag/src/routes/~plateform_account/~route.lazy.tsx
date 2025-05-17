import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { DashHeaders } from "mtxuilib/mt/DashContent";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "mtxuilib/ui/breadcrumb";
import { RootAppWrapper } from "../../components/RootAppWrapper";
import { WorkbrenchProvider } from "../../stores/workbrench.store";
import { NavPlateformAccount } from "./siderbar";
export const Route = createLazyFileRoute("/plateform_account")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <WorkbrenchProvider>
        <RootAppWrapper secondSidebar={<NavPlateformAccount />}>
          <DashHeaders>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>plateform account</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </DashHeaders>
          <Outlet />
        </RootAppWrapper>
      </WorkbrenchProvider>
    </>
  );
}
