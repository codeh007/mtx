"use client";
import { DashSidebar } from "mtmaiui/components/sidebar/siderbar";
import { DashContent, DashHeaders } from "mtxuilib/mt/DashContent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { SidebarInset } from "mtxuilib/ui/sidebar";

export default function Page(props: { params }) {
  return (
    <>
      <DashSidebar />
      <SidebarInset>
        <DashHeaders>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>posts</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DashHeaders>
        <DashContent>
          <PostCreateView />
        </DashContent>
      </SidebarInset>
    </>
  );
}
