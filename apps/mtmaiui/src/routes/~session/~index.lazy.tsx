import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/session/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div>todo: 添加初始状态输入框,例如账号密码之类</div>
      {/* <ChatClient /> */}
    </>
  );
}
