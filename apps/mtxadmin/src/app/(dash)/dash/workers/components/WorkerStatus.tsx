"use client";

import { Badge } from "lucide-react";
import type { BadgeProps } from "mtxuilib/ui/badge";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "mtxuilib/ui/tooltip";

export const isHealthy = (worker?: Worker) => {
  const reasons: string[] = [];

  if (!worker) {
    reasons.push("Worker is undefined");
    return reasons;
  }

  if (worker.status !== "ACTIVE") {
    reasons.push("Worker has stopped heartbeating");
  }

  if (!worker.dispatcherId) {
    reasons.push("Worker has no assigned dispatcher");
  }

  if (!worker.lastHeartbeatAt) {
    reasons.push("Worker has no heartbeat");
  }

  return reasons;
};

export const WorkerStatus = ({
  status = "INACTIVE",
  health,
}: {
  status?: "ACTIVE" | "INACTIVE" | "PAUSED";
  health: string[];
}) => {
  const label: Record<typeof status, string> = {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
    PAUSED: "Paused",
  };

  const variant: Record<typeof status, BadgeProps["variant"]> = {
    ACTIVE: "successful",
    INACTIVE: "failed",
    PAUSED: "inProgress",
  };

  return (
    <div className="flex flex-row gap-2 item-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant={variant[status]}>{label[status]}</Badge>
          </TooltipTrigger>
          <TooltipContent>
            {health.map((reason, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <div key={i}>{reason}</div>
            ))}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
