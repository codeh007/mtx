import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/session/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    
    <div className="flex items-center justify-center h-full">
              No session selected. Create or select a session from the sidebar.
    </div>
    
  )
}
