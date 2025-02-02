import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/gallery/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        Select a gallery from the sidebar or create a new one
      </div>
    </>
  )
}
