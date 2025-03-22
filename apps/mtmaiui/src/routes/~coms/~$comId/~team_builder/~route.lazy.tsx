import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { MtTabs, MtTabsList, MtTabsTrigger } from "mtxuilib/mt/tabs";

export const Route = createLazyFileRoute("/coms/$comId/team_builder")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="px-4 space-y-4">
      <MtTabs defaultValue="team" className="w-full">
        <MtTabsList layout="underlined">
          <CustomLink to="team">
            <MtTabsTrigger variant="underlined" value="team">
              团队
            </MtTabsTrigger>
          </CustomLink>
          <CustomLink to="agent">
            <MtTabsTrigger variant="underlined" value="agents">
              agent
            </MtTabsTrigger>
          </CustomLink>
        </MtTabsList>
        <Outlet />
      </MtTabs>
    </div>
  );
}
