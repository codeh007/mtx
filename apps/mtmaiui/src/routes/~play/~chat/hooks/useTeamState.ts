"use client";

import { useQuery } from "@tanstack/react-query";
import { agStateGetOptions } from "mtmaiapi";
import { useTenantId } from "../../../../hooks/useAuth";

interface useTeamStateProps {
  chatId: string;
}
export const useTeamStateQuery = ({ chatId }: useTeamStateProps) => {
  const tid = useTenantId();
  const agStateQuery = useQuery({
    ...agStateGetOptions({
      path: {
        tenant: tid,
      },
      query: {
        chat: chatId,
      },
    }),
  });
  return agStateQuery;
};
