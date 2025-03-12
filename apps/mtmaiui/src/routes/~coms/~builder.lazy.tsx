import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/coms/builder')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1>Builder</h1>
    </div>
  )
}
