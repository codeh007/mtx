import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/builder/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>builder home page</div>
}
