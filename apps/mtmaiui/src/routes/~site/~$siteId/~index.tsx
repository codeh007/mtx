import { Outlet, createFileRoute } from "@tanstack/react-router";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import {
  MtTabs,
  MtTabsContent,
  MtTabsList,
  MtTabsTrigger,
} from "mtxuilib/mt/tabs";

export const Route = createFileRoute("/site/$siteId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { siteId } = Route.useParams();
  return (
    <div>
      <MtTabs defaultValue="site" className="w-full h-full">
        <MtTabsList className="flex w-full gap-2">
          <MtTabsTrigger value="site">编辑</MtTabsTrigger>
          <CustomLink to={`/dash/site/${siteId}/host/`}>
            <MtTabsTrigger value="host">域名</MtTabsTrigger>
          </CustomLink>
          <MtTabsTrigger value="post">文章</MtTabsTrigger>
        </MtTabsList>
        <MtTabsContent value="site">
          {/* <SiteEditor siteId={siteId} /> */}
        </MtTabsContent>
        <MtTabsContent value="host">
          {/* <SiteHostListView tenant={tenant!} site={site.data} /> */}
        </MtTabsContent>
        <MtTabsContent value="post">
          {/* <PostListView siteId={siteId} /> */}
        </MtTabsContent>
      </MtTabs>

      <Outlet />
    </div>
  );
}
