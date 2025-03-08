'use client'
import { Outlet, createLazyFileRoute } from '@tanstack/react-router'
export const Route = createLazyFileRoute(
  '/platform-account/$platformAccountId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  )
}
