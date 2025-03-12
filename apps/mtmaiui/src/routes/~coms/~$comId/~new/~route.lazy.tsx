import { createLazyFileRoute } from "@tanstack/react-router";
import { CustomLink } from "mtxuilib/mt/CustomLink";

export const Route = createLazyFileRoute("/coms/$comId/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <CustomLink to={"../type/instagramTeam"}>instagram 团队</CustomLink>
    </div>
  );
}
