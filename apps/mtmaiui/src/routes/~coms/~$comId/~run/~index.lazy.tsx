"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { workflowRunListOptions } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useTenantId } from "../../../../hooks/useAuth";

export const Route = createLazyFileRoute("/coms/$comId/run/")({
  component: RouteComponent,
});

function RouteComponent() {
  const tid = useTenantId();
  const { comId } = Route.useParams();
  const runsQuery = useSuspenseQuery({
    ...workflowRunListOptions({
      path: {
        tenant: tid,
      },
      query: {
        additionalMetadata: [`componentId:${comId}`],
      },
    }),
  });
  return (
    <div>
      <DebugValue data={runsQuery.data} />
    </div>
  );
}
