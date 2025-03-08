import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/resource/$resId/$chat')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <h1>chat resource view</h1>
  </div>
}
