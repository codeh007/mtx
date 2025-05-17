import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { RootAppWrapper } from "../../components/RootAppWrapper";
import { WorkbrenchProvider } from "../../stores/workbrench.store";

export const Route = createLazyFileRoute("/bundler")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
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
    </>
  );
}
