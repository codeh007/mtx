import { createFileRoute } from "@tanstack/react-router";

import { useSuspenseQuery } from "@tanstack/react-query";
import { type Site, siteListOptions } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { useMemo } from "react";

import { SiteListViewHeader } from "../../components/site/SiteListViewHeader";
import { useTenant } from "../../hooks/useAuth";

export const Route = createFileRoute("/site/")({
  component: RouteComponent,
});

function RouteComponent() {
  const tenant = useTenant();
  const listQuery = useSuspenseQuery({
    ...siteListOptions({
      path: {
        tenant: tenant!.metadata.id,
      },
    }),
  });
  const isEmpty = useMemo(() => {
    return listQuery.data?.rows?.length === 0;
  }, [listQuery.data?.rows]);
  return (
    <div className="flex flex-col h-full w-full ">
      {isEmpty ? (
        // <ListViewEmpty message="没有可用数据" linkToCreate="/dash/site/new" />
        <></>
      ) : (
        <>
          <SiteListViewHeader />

          <div className="flex flex-col gap-2">
            {listQuery.data?.rows?.map((site) => (
              <SiteListItem key={site.metadata.id} site={site} />
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
        <CustomLink to={`/dash/site/${site.metadata.id}`}>
          {site.title}
        </CustomLink>
      </div>
      <div className="flex-0">
        <DebugValue data={site} />
      </div>
    </div>
  );
};
