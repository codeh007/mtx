import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/trigger')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/trigger"!</div>
}
