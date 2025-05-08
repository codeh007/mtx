import { createLazyFileRoute } from "@tanstack/react-router";
import { RemotionNextDemo1 } from "../../components/remotion/RemotionNextDemo1";

export const Route = createLazyFileRoute("/remotion_demo/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <RemotionNextDemo1 title={"一些文字333"} />
    </>
  );
}
