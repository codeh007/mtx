import { Outlet, createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/agents/$sessionId/state')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  )
}
