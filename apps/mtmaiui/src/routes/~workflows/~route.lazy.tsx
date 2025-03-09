"use client";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { DashHeaders } from "../../components/DashHeaders";
import { RootAppWrapper } from "../components/RootAppWrapper";
export const Route = createLazyFileRoute("/workflows")({
  component: RouteComponent,

  // loader: async () => {
  //   // const queryClient = useQueryClient();
  //   // return {
  //   //   queryClient,
  //   // };
  // },
});

function RouteComponent() {
  return (
    <RootAppWrapper>
      <DashHeaders>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>工作流</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </DashHeaders>
      <Outlet />
    </RootAppWrapper>
  );
}
