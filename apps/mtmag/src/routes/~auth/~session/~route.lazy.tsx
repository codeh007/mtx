import { SessionProvider, useSession } from "@hono/auth-js/react";
import { createLazyFileRoute } from "@tanstack/react-router";
export const Route = createLazyFileRoute("/auth/session")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <SessionProvider>
        <Children />
      </SessionProvider>
    </>
  );
}

function Children() {
  const { data: session, status } = useSession();
  return <pre> {JSON.stringify(session?.user, null, 2)}</pre>;
}
