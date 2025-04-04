import { createLazyFileRoute } from "@tanstack/react-router";
import { ChatClient } from "../~play/~chat/chat/Chat.client";

export const Route = createLazyFileRoute("/session/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div>todo: 添加初始状态输入框,例如账号密码之类</div>
      <ChatClient />
    </>
  );
}
