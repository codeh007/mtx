"use client";

import type { AgState } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";

interface AgStateViewProps {
  agState: AgState;
}
export const AgStateView = ({ agState }: AgStateViewProps) => {
  return (
    <div>
      AgStateView
      <DebugValue title="agState" data={{ state: agState }} />
    </div>
  );
};
