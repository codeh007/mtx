import { createLazyFileRoute } from "@tanstack/react-router";
import { CustomLink } from "mtxuilib/mt/CustomLink";

export const Route = createLazyFileRoute("/tenant/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1>tenants 管理(TODO)</h1>
      <CustomLink to="/tenant/setting">setting</CustomLink>
    </div>
  );
}
