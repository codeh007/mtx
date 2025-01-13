import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/posts/')({
  component: RoutePostListComponent,
})

export function RoutePostListComponent() {
  return <div>Hello "/layouts/posts/"!</div>
}
