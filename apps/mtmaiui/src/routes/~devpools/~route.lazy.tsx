import { createLazyFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/devpools")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <h1>设备池 api</h1>
      <p>
        这里显示设备池。 一般就是安装在 windows 上的 mtbot 程序，通过api 的方式，控制主机内的多个
        基于雷电9 模拟器的多台设备
      </p>

      <Outlet />
    </>
  );
}
