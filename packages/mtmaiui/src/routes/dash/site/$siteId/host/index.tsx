import { createFileRoute } from "@tanstack/react-router";

import { useSuspenseQuery } from "@tanstack/react-query";
import { siteHostListOptions } from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import type { SiteHost } from "mtmaiapi/gomtmapi/types.gen";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { Button } from "mtxuilib/ui/button";
import { CustomLink } from "../../../../../components/CustomLink";
import { useTenant } from "../../../../../hooks/useAuth";

export const Route = createFileRoute("/dash/site/$siteId/host/")({
  component: RouteComponent,
});

// interface SiteHostListViewProps {
//   tenant: Tenant;
//   site: Site;
// }

function RouteComponent() {
  const { siteId } = Route.useParams();
  console.log("siteId", siteId);
  const tenant = useTenant();
  const query = useSuspenseQuery({
    ...siteHostListOptions({
      path: {
        tenant: tenant!.metadata.id,
        // host: site.metadata.id,
      },
      query: {
        siteId: siteId,
      },
    }),
  });
  return (
    <div>
      <div className="flex p-2 justify-end">
        <DebugValue
          data={{
            data: query.data,
          }}
        />
        <div>
          <CustomLink to={`/dash/site/${siteId}/host/create`}>
            <Button>增加 site host</Button>
          </CustomLink>
        </div>
      </div>
      {query.data?.rows?.map((host) => (
        <SiteHostListItem key={host.metadata.id} host={host} />
      ))}
    </div>
  );
}

export const SiteHostListItem = ({ host }: { host: SiteHost }) => {
  return (
    <div className="bg-blue-500 p-2">
      {host.metadata.id}
      <div>{host.host}</div>
    </div>
  );
};
