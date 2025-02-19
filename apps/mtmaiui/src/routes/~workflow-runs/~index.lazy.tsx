'use client'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useTenant } from '../../hooks/useAuth'
import { WorkflowRunsTable } from './components/workflow-runs-table'

export const Route = createLazyFileRoute('/workflow-runs/')({
  component: RouteComponent,
})

function RouteComponent() {
  const tenant = useTenant()
  return (
    <>
      <WorkflowRunsTable tenant={tenant!} showMetrics={true} />
    </>
  )
}
