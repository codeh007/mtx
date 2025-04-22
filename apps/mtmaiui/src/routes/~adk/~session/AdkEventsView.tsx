"use client";

import { useQuery } from "@tanstack/react-query";
import { adkEventsListOptions } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useTenantId } from "../../../hooks/useAuth";

interface AdkEventsViewProps {
  sessionId: string;
}
export const AdkEventsView = ({ sessionId }: AdkEventsViewProps) => {
  const tid = useTenantId();
  const adkStateQuery = useQuery({
    ...adkEventsListOptions({
      path: {
        tenant: tid,
        // session: sessionId,
      },
    }),
  });

  return (
    <div className="border border-gray-200 rounded-md p-2 bg-blue-50">
      events
      <DebugValue data={{ data: adkStateQuery.data }} />
    </div>
  );
};
