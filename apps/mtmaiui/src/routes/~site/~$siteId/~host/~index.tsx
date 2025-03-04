import { createFileRoute } from "@tanstack/react-router";

import { useSuspenseQuery } from "@tanstack/react-query";
import { siteHostListOptions } from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { Button } from "mtxuilib/ui/button";

import { useTenant } from "../../../../hooks/useAuth";

export const Route = createFileRoute("/site/$siteId/host/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { siteId } = Route.useParams();
  console.log("siteId", siteId);
  const tenant = useTenant();
  const query = useSuspenseQuery({
    ...siteHostListOptions({
      path: {
        tenant: tenant!.metadata.id,
      },
      query: {
        siteId: siteId,
      },
    }),
  });
  return (
    <>
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
        <div key={host.metadata.id} className="bg-slate-100 p-2 space-y-2">
          {host.metadata.id}
          <div>{host.host}</div>
        </div>
      ))}
    </>
  );
}
