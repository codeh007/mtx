import { createLazyFileRoute } from "@tanstack/react-router";
import { RootAppWrapper } from "../components/RootAppWrapper";
import { NavComs } from "./siderbar";

export const Route = createLazyFileRoute("/coms/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RootAppWrapper secondSidebar={<NavComs />}>
      <div>组件首页</div>
    </RootAppWrapper>
  );
}
