import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/resource/$resId/browser')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1>browser resource view</h1>
    </div>
  )
}
