import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/resource/$resId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/resource/resId/"!</div>
}
