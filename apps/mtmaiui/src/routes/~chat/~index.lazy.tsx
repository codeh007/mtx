import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "mtxuilib/ui/button";
import { useNav } from "../../hooks/useNav";

export const Route = createLazyFileRoute("/chat/")({
  component: RouteComponent,
});

function RouteComponent() {
  const nav = useNav();
  return (
    <div>
      <Button
        onClick={() => {
          nav({ to: "/chat/sessionId/new" });
        }}
      >
        new chat
      </Button>
    </div>
  );
}
