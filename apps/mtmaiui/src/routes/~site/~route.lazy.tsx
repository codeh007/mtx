import { Outlet, createLazyFileRoute } from "@tanstack/react-router";

import { WorkbrenchProvider } from "@mtmaiui/stores/workbrench.store";
import { RootAppWrapper } from "../../components/RootAppWrapper";
export const Route = createLazyFileRoute("/site")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <WorkbrenchProvider>
      <RootAppWrapper>
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
    </WorkbrenchProvider>
  );
}
