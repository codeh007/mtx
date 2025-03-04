import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/play/chat/$sessionId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <></>
}
