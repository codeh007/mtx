import { createFileRoute } from "@tanstack/react-router";
import { CustomLink } from "mtxuilib/mt/CustomLink";

export const Route = createFileRoute("/resource/create/res/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1>选定资源类型</h1>

      <div>
        <CustomLink to="platform_account">平台账号</CustomLink>
      </div>
    </div>
  );
}
