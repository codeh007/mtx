import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "mtxuilib/ui/button";

export const Route = createLazyFileRoute("/sys/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Button>系统重新初始化(TODO)</Button>
    </div>
  );
}
