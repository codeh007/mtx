import { createLazyFileRoute } from '@tanstack/react-router'
import { useTenant } from '../../hooks/useAuth'
import { useMtmaiV2 } from '../../stores/StoreProvider'
import { GraphProvider } from '../../stores/GraphContext'
import { Canvas } from '../../components/opencanvas/canvas'

export const Route = createLazyFileRoute('/chat/$sessionId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { sessionId } = Route.useParams()

  const tenant = useTenant()
  if (!tenant) {
    null
  }
  const selfBackendend = useMtmaiV2((x) => x.selfBackendUrl)
  if (!selfBackendend) {
    null
  }
  return (
    <GraphProvider
      agentEndpointBase={selfBackendend!}
      tenant={tenant!}
      threadId={sessionId}
    >
      <Canvas />
    </GraphProvider>
  )
}
