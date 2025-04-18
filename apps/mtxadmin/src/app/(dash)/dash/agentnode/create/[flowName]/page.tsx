"use client";

import { DashSidebar } from "mtmaiui/components/sidebar/siderbar";
import { DashHeaders, DashContent } from "mtxuilib/mt/DashContent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";

import { SidebarInset } from "mtxuilib/ui/sidebar";
import { useParams } from "next/navigation";

export default function Page(props: { params }) {
  const { flowName } = useParams();
  return (
    <>
      <DashSidebar />
      <SidebarInset>
        <DashHeaders>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>create run ({flowName})</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DashHeaders>
        <DashContent>
          {/* <FlowForms flowName={flowName as string} /> */}
        </DashContent>
      </SidebarInset>
    </>
  );
}
