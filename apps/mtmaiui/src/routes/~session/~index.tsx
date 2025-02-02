import { createFileRoute } from '@tanstack/react-router'
// import { SessionManager } from '../../components/views/session/manager.tsx--'

export const Route = createFileRoute('/session/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main style={{ height: '100%' }} className=" h-full ">
      {/* <SessionManager /> */}
      session home
    </main>
  )
}
