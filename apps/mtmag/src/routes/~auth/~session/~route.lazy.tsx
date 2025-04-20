import { useSession } from "@hono/auth-js/react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { MtSessionProvider } from "../../../stores/SessionProvider";
export const Route = createLazyFileRoute("/auth/session")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <MtSessionProvider>
        <Children />
      </MtSessionProvider>
    </>
  );
}

function Children() {
  const { data: session, status } = useSession();
  return <pre> {JSON.stringify(session?.user, null, 2)}</pre>;
}
