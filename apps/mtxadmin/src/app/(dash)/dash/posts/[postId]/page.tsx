"use client";

import { DashContent, DashHeaders } from "mtmaiui/components/DashContent";
import { DashSidebar } from "mtmaiui/components/sidebar/siderbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { SidebarInset } from "mtxuilib/ui/sidebar";
import { use } from "react";

export default function (props: {
  params: {
    postId: string;
  };
}) {
  //@ts-ignore
  const { postId } = use(props.params);
  return (
    <>
      <DashSidebar />
      <SidebarInset>
        <DashHeaders>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Post({postId})</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DashHeaders>
        <DashContent>{/* <PostShow postId={postId} /> */}</DashContent>
      </SidebarInset>
    </>
  );
}
