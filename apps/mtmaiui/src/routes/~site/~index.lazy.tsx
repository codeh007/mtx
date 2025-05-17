import { createLazyFileRoute } from "@tanstack/react-router";

import { useQuery } from "@tanstack/react-query";
// import { type Site } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { useMemo } from "react";

import type { Site } from "mtmaiapi";
import { SiteListViewHeader } from "../../components/site/SiteListViewHeader";

export const Route = createLazyFileRoute("/site/")({
  component: RouteComponent,
});

function RouteComponent() {
  const listSites = useQuery({
    queryKey: ["sites"],
    queryFn: async () => {
      const res = await fetch("/api/sites");
      return res.json();
    },
  });
  const isEmpty = useMemo(() => {
    return listSites.data?.data?.length === 0;
  }, [listSites.data?.data]);
  return (
    <div className="flex flex-col h-full w-full ">
      {isEmpty ? (
        <>
          <span>没有可用数据</span>
        </>
      ) : (
        <>
          <SiteListViewHeader />

          <div className="flex flex-col gap-2">
            {listSites.data?.data?.map((site) => (
              <SiteListItem key={site.id} site={site} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

interface SiteListItemProps {
  site: Site;
}
const SiteListItem = ({ site }: SiteListItemProps) => {
  return (
    <div className="flex bg-red-100 p-2 ">
      <div className="flex-1">
        <CustomLink to={`/site/${site.id}`}>{site.title}</CustomLink>
      </div>
      <div className="flex-0">
        <DebugValue data={site} />
      </div>
    </div>
  );
};
