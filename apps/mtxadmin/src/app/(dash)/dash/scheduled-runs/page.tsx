"use client";
import { DashSidebar } from "mtmaiui/components/sidebar/siderbar";
import { ScheduledRunsTable } from "mtmaiui/routes/~scheduled-runs/scheduled-runs-table";
import { DashContent, DashHeaders } from "mtxuilib/mt/DashContent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { Separator } from "mtxuilib/ui/separator";
import { SidebarInset } from "mtxuilib/ui/sidebar";

export default function RateLimits() {
  return (
    <>
      <DashSidebar />
      <SidebarInset>
        <DashHeaders>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Scheduled Runs</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DashHeaders>
        <DashContent>
          <div className="flex-grow h-full w-full">
            <div className="mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
              <Separator className="my-4" />
              <ScheduledRunsTable />
            </div>
          </div>
        </DashContent>
      </SidebarInset>
    </>
  );
}
