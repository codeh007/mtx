import { createLazyFileRoute } from "@tanstack/react-router";
import { CustomLink } from "mtxuilib/mt/CustomLink";

export const Route = createLazyFileRoute("/coms/$comId/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex w-full flex-col gap-2 justify-center items-center">
      <CustomLink to={"../type/instagramTeam"}>instagram 团队</CustomLink>
      <CustomLink to={"../type/assisant"}>Assisant 团队</CustomLink>
    </div>
  );
}
