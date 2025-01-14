import { useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { siteGetOptions } from "mtmaiapi/gomtmapi/@tanstack/react-query.gen.js";
import {
  MtTabs,
  MtTabsContent,
  MtTabsList,
  MtTabsTrigger,
} from "mtxuilib/mt/tabs";
import { SiteHostListView } from "../../../components/site-host/SiteHostListView";
import { SiteEditor } from "../../../components/site/SiteEditor";
import { useTenant } from "../../../hooks/useAuth";

export const Route = createFileRoute("/dash/site/$siteId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { siteId } = Route.useParams();
  const tenant = useTenant();
  // if (!tenant) {
  //   return null;
  // }
  const site = useSuspenseQuery({
    ...siteGetOptions({
      path: {
        tenant: tenant!.metadata.id,
        site: siteId,
      },
    }),
  });
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
        <MtTabsContent value="host">
          <SiteHostListView tenant={tenant!} site={site.data} />
        </MtTabsContent>
      </MtTabs>

      <Outlet />
    </div>
  );
}
