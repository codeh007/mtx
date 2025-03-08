import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { CustomLink } from "mtxuilib/mt/CustomLink";

export const Route = createLazyFileRoute("/resource/create/res")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <h1>选定资源类型</h1>

      <div>
        <CustomLink to="res/platform_account">平台账号</CustomLink>
      </div>
      <Outlet />
    </>
  );
}
