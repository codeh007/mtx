"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { type Site, siteListOptions } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useMemo } from "react";
import { useTenant } from "../../hooks/useAuth";
import { CustomLink } from "../CustomLink";
import { SiteListViewHeader } from "./SiteListViewHeader";

export default function SiteListView() {
  // const router = useMtRouter();
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
    <div>
      <DebugValue data={site} />
      <div>
        <CustomLink to={`/dash/site/${site.metadata.id}`}>
          {site.title}
        </CustomLink>
      </div>
    </div>
  );
};
