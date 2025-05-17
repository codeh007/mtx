import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "mtxuilib/ui/tabs";

export const Route = createLazyFileRoute("/site/$siteId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { siteId } = Route.useParams();
  return (
    <div>
      <Tabs defaultValue="site" className="w-full h-full">
        <TabsList className="flex w-full gap-2">
          <CustomLink to={`/site/${siteId}/edit/`}>
            <TabsTrigger value="site">编辑</TabsTrigger>
          </CustomLink>
          <CustomLink to={`/site/${siteId}/host/`}>
            <TabsTrigger value="host">域名</TabsTrigger>
          </CustomLink>
          <TabsTrigger value="post">文章</TabsTrigger>
        </TabsList>
        <TabsContent value="site">{/* <SiteEditor siteId={siteId} /> */}</TabsContent>
        <TabsContent value="host">
          {/* <SiteHostListView tenant={tenant!} site={site.data} /> */}
        </TabsContent>
        <TabsContent value="post">{/* <PostListView siteId={siteId} /> */}</TabsContent>
      </Tabs>
      <Outlet />
    </div>
  );
}
