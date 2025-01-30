import { createFileRoute } from '@tanstack/react-router'
import Layout from '../components/layout'
import { SessionManager } from '../components/views/session/manager'

export const Route = createFileRoute('/ag/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout title="Home" link={'/'}>
      <main style={{ height: '100%' }} className=" h-full ">
        <SessionManager />
      </main>
    </Layout>
  )
}
