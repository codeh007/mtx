"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { siteHostListOptions } from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import type { Site, SiteHost, Tenant } from "mtmaiapi/gomtmapi/types.gen";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";

interface SiteHostListViewProps {
  tenant: Tenant;
  site: Site;
}
export function SiteHostListView({ tenant, site }: SiteHostListViewProps) {
  const query = useSuspenseQuery({
    ...siteHostListOptions({
      path: {
        tenant: tenant.metadata.id,
        // host: site.metadata.id,
        // si
      },
      query: {
        siteId: site.metadata.id,
      },
    }),
  });
  return (
    <div>
      <DebugValue
        data={{
          data: query.data,
        }}
      />
      {query.data?.rows?.map((host) => (
        <SiteHostListItem key={host.metadata.id} host={host} />
      ))}
    </div>
  );
}

export const SiteHostListItem = ({ host }: { host: SiteHost }) => {
  return (
    <div>
      {host.metadata.id}
      <div>{host.host}</div>
    </div>
  );
};
