'use client'
import { createFileRoute } from '@tanstack/react-router'
import { SidebarInset } from "mtxuilib/ui/sidebar"
import { Breadcrumb } from "mtxuilib/ui/breadcrumb"
import { BreadcrumbList } from "mtxuilib/ui/breadcrumb"
import { BreadcrumbItem } from "mtxuilib/ui/breadcrumb"
import { BreadcrumbPage } from "mtxuilib/ui/breadcrumb"
import { Suspense } from 'react'
import { DashContent } from '../../components/DashContent'
import { DashSidebar } from '../../components/sidebar/siderbar'
import { DashHeaders } from '../../components/DashHeaders'
import dynamic from 'next/dynamic'
export const Route = createFileRoute('/workflows/')({
  component: RouteComponent,
})


const WorkflowTableLazy = dynamic(()=>import(
  '../../components/workflow/workflow-table').then(x=>x.WorkflowTable),{
      ssr:false})
      
function RouteComponent() {
  return <div>Hello "/workflows/"!

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
            <WorkflowTableLazy />
          </Suspense>
        </DashContent>
      </SidebarInset>
  </div>
}
