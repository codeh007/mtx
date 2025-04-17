import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/site/$siteId/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dash/site/$siteId/edit"!</div>
}
