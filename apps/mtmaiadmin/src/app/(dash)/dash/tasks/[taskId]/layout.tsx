"use client";

import { DashSidebar } from "mtmaiui/components/sidebar/siderbar";

import { MtErrorBoundary } from "mtxuilib/components/MtErrorBoundary";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "mtxuilib/ui/breadcrumb";
import { Separator } from "mtxuilib/ui/separator";
import { SidebarInset, SidebarTrigger } from "mtxuilib/ui/sidebar";
import { Skeleton } from "mtxuilib/ui/skeleton";
import { type ReactNode, Suspense } from "react";

export default function Layout(props: {
  params: { taskId: string };
  children: ReactNode;
}) {
  const {
    params: { taskId },
    children,
  } = props;
  return (
    <>
      <DashSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {/* <BreadcrumbItem className="hidden md:block">
								<BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" /> */}
              <BreadcrumbItem>
                <BreadcrumbPage>任务详情</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Suspense fallback={<Skeleton className="h-32 w-full" />}>
            <MtErrorBoundary>
              {/* <TaskDetails taskId={taskId} /> */}
              {children}
            </MtErrorBoundary>
          </Suspense>
        </div>
      </SidebarInset>
    </>
  );
}
