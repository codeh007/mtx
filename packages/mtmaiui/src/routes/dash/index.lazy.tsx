import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dash/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="bg-yellow-100 p-2">Hello "/dash/"!</div>
}
