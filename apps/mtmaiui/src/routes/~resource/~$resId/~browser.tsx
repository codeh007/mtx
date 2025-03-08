import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/resource/$resId/browser')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    
    <h1>browser resource view</h1>
  </div>
}
