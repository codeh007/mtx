import { createLazyFileRoute } from '@tanstack/react-router'
import { useTenant } from '../../hooks/useAuth'
import { AgEventsTable } from './components/ag-events-table'

export const Route = createLazyFileRoute('/agEvents/')({
  component: RouteComponent,
})

function RouteComponent() {
  const tenant = useTenant()
  if (!tenant) return null
  return (
    <>
      <AgEventsTable tenant={tenant} />
    </>
  )
}
