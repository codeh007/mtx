import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/model/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/model/"!</div>
}
