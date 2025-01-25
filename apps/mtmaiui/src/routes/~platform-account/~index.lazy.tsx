import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/platform-account/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/account/"!</div>
}
