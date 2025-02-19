'use client'
import { createLazyFileRoute } from '@tanstack/react-router'
import { MtSuspenseBoundary } from 'mtxuilib/components/MtSuspenseBoundary'

export const Route = createLazyFileRoute('/settings/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <MtSuspenseBoundary>设置</MtSuspenseBoundary>
}
