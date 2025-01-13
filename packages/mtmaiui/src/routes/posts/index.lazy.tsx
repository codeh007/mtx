import { createLazyFileRoute } from '@tanstack/react-router'

export type PostType = {
  id: string
  title: string
  body: string
}

export const Route = createLazyFileRoute('/posts/')({
  component: RoutePostListComponent,
})

export function RoutePostListComponent() {
  return <div>Posts "/layouts/posts/"!</div>
}
