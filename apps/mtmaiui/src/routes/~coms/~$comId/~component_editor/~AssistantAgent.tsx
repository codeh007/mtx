import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/coms/$comId/component_editor/AssistantAgent',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-blue-200">
      <h1>assistant agent component</h1>
    </div>
  )
}
