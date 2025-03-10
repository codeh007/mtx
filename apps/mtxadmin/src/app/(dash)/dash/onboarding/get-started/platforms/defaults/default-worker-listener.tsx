"use client";
import { useQuery } from "@tanstack/react-query";
import JSConfetti from "js-confetti";
import { queries } from "mtmaiapi/api";
import { MtLoading } from "mtxuilib/mt/mtloading";
import { useEffect, useRef } from "react";

export const WorkerListener: React.FC<{
  tenantId: string;
  setWorkerConnected: (val: boolean) => void;
}> = ({ tenantId, setWorkerConnected }) => {
  const listWorkersQuery = useQuery({
    ...queries.workers.list(tenantId),
    refetchInterval: 1000,
  });

  const prevConnectedRef = useRef(false);

  useEffect(() => {
    const connected =
      listWorkersQuery.data?.rows && listWorkersQuery.data.rows.length > 0;

    if (connected && !prevConnectedRef.current) {
      const jsConfetti = new JSConfetti();
      jsConfetti.addConfetti({
        emojis: ["🪓"],
      });
    }

    prevConnectedRef.current = connected ?? false;
    setWorkerConnected(!!connected);
  }, [listWorkersQuery.data?.rows, setWorkerConnected]);

  if (
    listWorkersQuery.isLoading ||
    !listWorkersQuery.data?.rows ||
    listWorkersQuery.data.rows.length === 0
  ) {
    return (
      <div className="flex flex-row items-center">
        <MtLoading className="shrink grow-0" />
        Waiting for worker to connect...
      </div>
    );
  }

  return <div>🪓 Worker Connected!</div>;
};
