"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import type { Tenant } from "mtmaiapi/gomtmapi/types.gen";

import type { Site } from "mtmaiapi/gomtmapi/types.gen";

interface SiteHostListViewProps {
  tenant: Tenant;
  site: Site;
}
export function SiteHostListView({ tenant, site }: SiteHostListViewProps) {
  const query = useSuspenseQuery({
    ...siteHostListQueryOptions(),
  });
  return <div>SiteHostListView</div>;
}
