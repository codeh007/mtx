import { createLazyFileRoute } from "@tanstack/react-router";
import { ChatClient } from "../~play/~chat/chat/Chat.client";

export const Route = createLazyFileRoute("/session/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <ChatClient />
    </>
  );
}
