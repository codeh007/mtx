import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/platform')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/platform"!</div>
}
