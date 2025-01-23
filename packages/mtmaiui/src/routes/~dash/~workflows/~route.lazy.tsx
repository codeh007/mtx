'use client'
import { createLazyFileRoute, Outlet } from '@tanstack/react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from 'mtxuilib/ui/breadcrumb'
import { SidebarInset } from 'mtxuilib/ui/sidebar'
import { Suspense } from 'react'
import { DashContent } from '../../../components/DashContent'
import { DashHeaders } from '../../../components/DashHeaders'
import { DashSidebar } from '../../../components/sidebar/siderbar'
import { useTenant } from '../../../hooks/useAuth'
export const Route = createLazyFileRoute('/dash/workflows')({
  component: RouteComponent,
})

function RouteComponent() {
  const tenant = useTenant()

  if (!tenant) return null

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
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </DashContent>
      </SidebarInset>
    </>
  )
}
