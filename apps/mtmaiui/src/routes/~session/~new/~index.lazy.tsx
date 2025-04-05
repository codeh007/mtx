import { createLazyFileRoute } from "@tanstack/react-router";
import { CustomLink } from "mtxuilib/mt/CustomLink";

export const Route = createLazyFileRoute("/session/new/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <CustomLink to={"social"}>社交媒体</CustomLink>
    </div>
  );
}
