'use client'

import { DashHeaders } from "../../../../components/DashHeaders"
import { DashContent } from "../../../../components/DashContent"
import { DashSidebar } from "../../../../components/sidebar/siderbar"
import { SidebarInset } from "mtxuilib/ui/sidebar"
import { Breadcrumb } from "mtxuilib/ui/breadcrumb"
import { BreadcrumbList } from "mtxuilib/ui/breadcrumb"
import { BreadcrumbItem } from "mtxuilib/ui/breadcrumb"
import { BreadcrumbPage } from "mtxuilib/ui/breadcrumb"
import { Suspense } from "react"
import dynamic from "next/dynamic"

const WorkflowTableLz = dynamic(()=>import(
    '../../../../components/workflow/workflow-table').then(x=>x.WorkflowTable),{
        ssr:false})
export default function DashPage() {
  return <>
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
          <Suspense fallback={<div>Loading...</div>}>
            <WorkflowTableLz />
          </Suspense>
        </DashContent>
      </SidebarInset>
  </>
}