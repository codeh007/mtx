import { Outlet, createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/session/$sessionId/state')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  )
}
