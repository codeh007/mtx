'use client'
import { useMutation } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { agentRunMutation } from 'mtmaiapi'
import { Button } from 'mtxuilib/ui/button'
import { useTenant } from '../../hooks/useAuth'

export const Route = createLazyFileRoute('/trigger/tenant')({
  component: RouteComponent,
})

function RouteComponent() {
  const tenant = useTenant()
  const agentRun = useMutation({
    ...agentRunMutation(),
  })
  return (
    <div className="flex flex-col gap-4">
      <h1>重置 tenant 数据</h1>
      <Button
        onClick={() =>
          agentRun.mutate({
            path: {
              tenant: tenant!.metadata.id,
            },
            body: { name: 'tenant', params: {} },
          })
        }
      >
        提交</Button>
    </div>
  )
}
