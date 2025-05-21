"use client";

import { useQuery } from "@tanstack/react-query";
import { siteHostListOptions } from "mtmaiapi";
import { SiteHostCreateDialog } from "./SiteHostNewView";
interface SiteHostListViewProps {
  siteId: string;
  tid: string;
}
export function SiteHostListView({ siteId, tid }: SiteHostListViewProps) {
  const siteHostQuery = useQuery({
    ...siteHostListOptions({
      path: {
        tenant: tid,
      },
      query: {
        siteId,
      },
    }),
  });
  return (
    <>
      <div className="flex p-2 justify-end">
        <SiteHostCreateDialog siteId={siteId} tid={tid} />
      </div>
      {siteHostQuery.data?.rows?.map((host) => (
        <div key={host.metadata.id} className="bg-slate-100 p-2 space-y-2">
          {host.metadata.id}
          <div>{host.host}</div>
        </div>
      ))}
    </>
  );
}
