"use client";
import { useEffect, useMemo, useState } from "react";
import TimeAgo from "timeago-react";
import { formatDuration } from "../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface RelativeDateProps {
  date?: Date | string;
  future?: boolean;
}

export const RelativeDate = ({
  date = "",
  future = false,
}: RelativeDateProps) => {
  const formattedDate = useMemo(
    () => (typeof date === "string" ? new Date(date) : date),
    [date],
  );

  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (future) {
      const updateCountdown = () => {
        const currentDate = new Date();
        const timeDiff = formattedDate.getTime() - currentDate.getTime();

        if (timeDiff <= 0) {
          setCountdown("");
          return;
        }

        const days = Math.floor(timeDiff / (1000 * 3600 * 24));
        const hours = Math.floor(
          (timeDiff % (1000 * 3600 * 24)) / (1000 * 3600),
        );
        const minutes = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        const countdownParts: string[] = [];
        if (days > 0) {
          countdownParts.push(`${days}d`);
        }
        if (hours > 0 || days > 0) {
          countdownParts.push(`${hours}h`);
        }
        if (minutes > 0 || hours > 0 || days > 0) {
          countdownParts.push(`${minutes}m`);
        }
        countdownParts.push(`${seconds}s`);

        setCountdown(countdownParts.join(" "));
      };

      updateCountdown();
      const countdownInterval = setInterval(updateCountdown, 1000);

      return () => {
        clearInterval(countdownInterval);
      };
    }
  }, [formattedDate, future]);

  if (date === "0001-01-01T00:00:00Z") {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          {future && countdown ? (
            <>{countdown}</>
          ) : (
            <TimeAgo datetime={formattedDate} />
          )}
        </TooltipTrigger>
        <TooltipContent className="z-[80]">
          {formattedDate.toLocaleString()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface RelativeDateLineProps {
  date_created_at: Date | string;
  date_updated_at?: Date | string;
  date_finished_at?: Date | string;
  date_started_at?: Date | string;
  duration?: number;
}
export const TaskDateBadge = ({
  date_created_at,
  date_updated_at,
  date_finished_at,
  date_started_at,
  duration,
}: RelativeDateLineProps) => {
  return (
    <div>
      <span className="text-sm text-muted-foreground">
        {duration && `用时:${formatDuration(duration)}`}
      </span>

      <div>
        {date_finished_at && (
          <>
            完成于: <RelativeDate date={date_finished_at} />
          </>
        )}
      </div>
      <div>
        {date_started_at && (
          <>
            开始于: <RelativeDate date={date_started_at} />
          </>
        )}
      </div>
      <div>
        {date_created_at && (
          <>
            创建于: <RelativeDate date={date_created_at} />
          </>
        )}
      </div>
    </div>
  );
};
