import { createLazyFileRoute } from "@tanstack/react-router";
import { useTenant } from "../../hooks/useAuth";
import { useMtmaiV2 } from "../../stores/StoreProvider";

import { Outlet } from "@tanstack/react-router";

import { SidebarInset } from "mtxuilib/ui/sidebar";
import { Suspense } from "react";
import { DashContent } from "../../components/DashContent";
import { DashSidebar } from "../../components/sidebar/siderbar";
import { RootAppWrapper } from "../components/RootAppWrapper";

export const Route = createLazyFileRoute("/chat")({
  component: RouteComponent,
});

function RouteComponent() {
  const tenant = useTenant();
  const selfBackendend = useMtmaiV2((x) => x.selfBackendUrl);
  if (!tenant) {
    null;
  }
  if (!selfBackendend) {
    null;
  }
  return (
    <RootAppWrapper>
      <DashSidebar />
      <SidebarInset>
        {/* <DashHeaders>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Workflows</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DashHeaders> */}
        <DashContent>
          <Suspense fallback={<div>Loading...</div>}>
            {/* <div className="fixed top-0 right-0 flex flex-col">
              <CustomLink
                className={cn(
                  "text-lg",
                  buttonVariants({ variant: "outline" }),
                )}
                to="/chat/canvas"
              >
                Canvas
              </CustomLink>
            </div> */}
            <Outlet />
          </Suspense>
        </DashContent>
      </SidebarInset>
    </RootAppWrapper>
  );
}
