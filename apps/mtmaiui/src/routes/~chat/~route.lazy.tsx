import { createLazyFileRoute } from "@tanstack/react-router";
import { useTenant } from "../../hooks/useAuth";
import { useMtmaiV2 } from "../../stores/StoreProvider";

import { Outlet } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
// import { DashSidebar } from "../../components/sidebar/siderbar";
// import { SidebarInset } from "../../ui/sidebar";
// import {DashSidebar} from "mtxuilib/ui/sidebar"
import { SidebarInset } from "mtxuilib/ui/sidebar";
import { DashContent } from "../../components/DashContent";
import { DashHeaders } from "../../components/DashHeaders";
import { DashSidebar } from "../../components/sidebar/siderbar";
import { GraphProvider } from "../../stores/GraphContext";
import { RootAppWrapper } from "../components/RootAppWrapper";

export const Route = createLazyFileRoute("/chat")({
  component: RouteComponent,
});

function RouteComponent() {
  const tenant = useTenant();
  if (!tenant) {
    null;
  }
  const selfBackendend = useMtmaiV2((x) => x.selfBackendUrl);
  if (!selfBackendend) {
    null;
  }
  return (
    <RootAppWrapper className="flex w-full h-full flex-1">
      <DashSidebar />

      <SidebarInset>
        <DashHeaders>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>chat</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DashHeaders>
        <DashContent>
          <MtSuspenseBoundary>
            <GraphProvider agentEndpointBase={selfBackendend!} tenant={tenant!}>
              <Outlet />
            </GraphProvider>
          </MtSuspenseBoundary>
        </DashContent>
      </SidebarInset>
    </RootAppWrapper>
  );
}
