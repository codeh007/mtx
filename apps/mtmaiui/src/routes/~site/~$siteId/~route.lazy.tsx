import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { Tabs, TabsList, TabsTrigger } from "mtxuilib/ui/tabs";

export const Route = createLazyFileRoute("/site/$siteId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { siteId } = Route.useParams();
  return (
    <>
      <Tabs defaultValue="site" className="w-full h-full">
        <TabsList className="flex w-full gap-2">
          <CustomLink to={`/site/${siteId}/edit/`}>
            <TabsTrigger value="site" variant="underlined">
              编辑
            </TabsTrigger>
          </CustomLink>
          <CustomLink to={`/site/${siteId}/host/`}>
            <TabsTrigger value="host" variant="underlined">
              域名
            </TabsTrigger>
          </CustomLink>
          <CustomLink to={`/site/${siteId}/post/`}>
            <TabsTrigger value="post" variant="underlined">
              文章
            </TabsTrigger>
          </CustomLink>
        </TabsList>
        <Outlet />
      </Tabs>
    </>
  );
}
