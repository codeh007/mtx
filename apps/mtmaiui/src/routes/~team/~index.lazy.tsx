import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/team/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex items-center   justify-center h-[calc(100vh-190px)]">
      Select a team from the sidebar or create a new one
    </div>
  )
}
