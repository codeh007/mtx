"use client";

import { useQuery } from "@tanstack/react-query";
import { adkSessionGetOptions } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useTenantId } from "../../../hooks/useAuth";

interface AdkSessionViewProps {
  sessionId: string;
}
export const AdkSessionView = ({ sessionId }: AdkSessionViewProps) => {
  const tid = useTenantId();
  const adkStateQuery = useQuery({
    ...adkSessionGetOptions({
      path: {
        tenant: tid,
        session: sessionId,
      },
    }),
  });

  return (
    <div className="border border-gray-300 rounded-md p-2">
      AdkSessionView
      <br />
      session id: {sessionId}
      <DebugValue data={{ data: adkStateQuery.data }} />
    </div>
  );
};
