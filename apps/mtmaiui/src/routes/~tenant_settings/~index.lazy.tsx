import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "mtxuilib/ui/button";

export const Route = createLazyFileRoute("/tenant_settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  const handleResetTenandSetting = () => {
    console.log("handleResetTenandSetting");
  };
  return (
    <div>
      <div>Tenant Settings</div>
      <Button onClick={handleResetTenandSetting}>重置租户配置</Button>
    </div>
  );
}
