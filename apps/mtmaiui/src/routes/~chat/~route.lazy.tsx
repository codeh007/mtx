import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { RootAppWrapper } from "../../components/RootAppWrapper";
import { WorkbrenchProvider } from "../../stores/workbrench.store";
import { WorkflowsProvider } from "../../stores/workflow-store";
import { NavChat } from "./siderbar";

export const Route = createLazyFileRoute("/chat")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <WorkbrenchProvider>
        {/* 加载第三方 python js 运行环境  */}
        {/* <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
        async={true}
      /> */}
        <WorkflowsProvider>
          <RootAppWrapper secondSidebar={<NavChat />}>
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
