import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/resource/$resId/$')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>unknown resource type</div>
}
