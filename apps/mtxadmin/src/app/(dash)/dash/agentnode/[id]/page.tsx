"use client";

import { DashHeaders } from "mtmaiui/components/DashContent";
import { DashSidebar } from "mtmaiui/components/sidebar/siderbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";

import { SidebarInset } from "mtxuilib/ui/sidebar";
import { use } from "react";

export default function Page(props: { params: { id: string } }) {
  //@ts-expect-error
  const { id } = use(props.params);
  return (
    <>
      <DashSidebar />
      <SidebarInset>
        <DashHeaders>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>agent nodes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DashHeaders>
        {/* <DashContent> <AgentNodeShowView id={id} /> </DashContent> */}
      </SidebarInset>
    </>
  );
}
