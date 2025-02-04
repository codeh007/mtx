import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/site/$siteId/host')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  )
}
