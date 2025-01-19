"use client";

import { DashSidebar } from "mtmaiui/components/sidebar/siderbar";

import { DashContent } from "mtmaiui/components/DashContent";
import { DashHeaders } from "mtmaiui/components/DashHeaders";
import { useTenant } from "mtmaiui/hooks/useAuth";
import { GraphV3Provider } from "mtmaiui/stores/GraphContextV2";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { SidebarInset } from "mtxuilib/ui/sidebar";

export default function CanvasHome() {
  const tenant = useTenant();
  return (
    <>
      <DashSidebar />
      <SidebarInset>
        <DashHeaders>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Workflows</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DashHeaders>
        <DashContent>
          <GraphV3Provider
            backendUrl="https://colab-gomtm.yuepa8.com"
            tenant={tenant}
          >
            <MtSuspenseBoundary>{/* <LzCanvas /> */}</MtSuspenseBoundary>
          </GraphV3Provider>
        </DashContent>
      </SidebarInset>
    </>
  );
}
