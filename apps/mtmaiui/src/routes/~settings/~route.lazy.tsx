'use client'
import { Outlet, createLazyFileRoute } from '@tanstack/react-router'
import { SkeletonListview } from 'mtxuilib/components/skeletons/SkeletonListView'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from 'mtxuilib/ui/breadcrumb'
import { Separator } from 'mtxuilib/ui/separator'
import { SidebarInset, SidebarTrigger } from 'mtxuilib/ui/sidebar'
import { Suspense } from 'react'
import { DashSidebar } from '../../components/sidebar/siderbar'
import { useTenant } from '../../hooks/useAuth'
import { RootAppWrapper } from '../components/RootAppWrapper'
import { MtSuspenseBoundary } from 'mtxuilib/components/MtSuspenseBoundary'
export const Route = createLazyFileRoute('/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  const tenant = useTenant()
  if (!tenant) {
    return <div>require tenant</div>
  }
  return (
    <RootAppWrapper>
      <DashSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>设置</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col">
          <Suspense fallback={<SkeletonListview />}>
            <MtSuspenseBoundary>
              <Outlet />
            </MtSuspenseBoundary>
          </Suspense>
        </div>
      </SidebarInset>
    </RootAppWrapper>
  )
}
