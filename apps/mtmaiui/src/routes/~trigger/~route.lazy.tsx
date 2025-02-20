"use client";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { SidebarInset } from "mtxuilib/ui/sidebar";
import { DashContent } from "../../components/DashContent";
import { DashHeaders } from "../../components/DashHeaders";
import { DashSidebar } from "../../components/sidebar/siderbar";
import { RootAppWrapper } from "../components/RootAppWrapper";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
export const Route = createLazyFileRoute('/trigger')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <RootAppWrapper>
      <DashSidebar />
      <SidebarInset>
        <DashHeaders>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Trigger</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DashHeaders>
        <DashContent>
          <MtSuspenseBoundary>
            <Outlet />
          </MtSuspenseBoundary>
        </DashContent>
      </SidebarInset>
    </RootAppWrapper>
  )
}
