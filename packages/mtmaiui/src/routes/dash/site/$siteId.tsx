import { Outlet, createFileRoute } from "@tanstack/react-router";
import {
  MtTabs,
  MtTabsContent,
  MtTabsList,
  MtTabsTrigger,
} from "mtxuilib/mt/tabs";
import { CustomLink } from "../../../components/CustomLink";
import { SiteEditor } from "../../../components/site/SiteEditor";
import { useTenant } from "../../../hooks/useAuth";

export const Route = createFileRoute("/dash/site/$siteId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { siteId } = Route.useParams();
  const tenant = useTenant();
  if (!tenant) {
    return null;
  }
  return (
    <div>
      <MtTabs defaultValue="site" className="w-full h-full">
        <MtTabsList className="flex w-full gap-2">
          <MtTabsTrigger value="site">编辑</MtTabsTrigger>
          <MtTabsTrigger value="host">域名</MtTabsTrigger>
        </MtTabsList>
        <MtTabsContent value="site">
          <SiteEditor siteId={siteId} />
        </MtTabsContent>
        <MtTabsContent value="host"></MtTabsContent>
      </MtTabs>

      <Outlet />
      <div>
        <CustomLink to={`/dash/site/${siteId}/hosts`}>host</CustomLink>
      </div>
    </div>
  );
}
