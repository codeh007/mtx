import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/tenant/settings/model_client_settings/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>模型客户端设置</div>
}
