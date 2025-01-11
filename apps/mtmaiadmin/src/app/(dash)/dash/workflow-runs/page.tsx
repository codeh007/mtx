"use client";

import { PlusIcon } from "lucide-react";
import { DashSidebar } from "mtmaiui/components/sidebar/siderbar";
import { useBasePath } from "mtmaiui/hooks/useBasePath";
import { WorkflowRunsTable } from "mtmaiui/modules/workflow-run/workflow-runs-table";
import { MtErrorBoundary } from "mtxuilib/components/MtErrorBoundary";
import { SkeletonListview } from "mtxuilib/components/skeletons/SkeletonListView";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { Button } from "mtxuilib/ui/button";
import { Separator } from "mtxuilib/ui/separator";
import { SidebarInset, SidebarTrigger } from "mtxuilib/ui/sidebar";
import Link from "next/link";
import { Suspense } from "react";
export default function Page() {
  const basePath = useBasePath();
  return (
    <>
      <DashSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>workflow runs</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Suspense fallback={<SkeletonListview />}>
            <MtErrorBoundary>
              <div>
                <Link href={`${basePath}/create/oneshot`}>
                  <Button>
                    <PlusIcon className="size-4" />
                    oneshot
                  </Button>
                </Link>
              </div>
              <WorkflowRunsTable showMetrics={true} />
            </MtErrorBoundary>
          </Suspense>
        </div>
      </SidebarInset>
    </>
  );
}
