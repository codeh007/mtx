"use client";
import type React from "react";

import CronPrettifier from "cronstrue";

import {
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { formatDuration } from "date-fns";
import {
  WorkflowRunStatus,
  eventGetOptions,
  workflowRunCancelMutation,
  workflowRunGetOptions,
  workflowRunUpdateReplayMutation,
} from "mtmaiapi";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { RelativeDate } from "mtxuilib/mt/relative-date";
import { Button } from "mtxuilib/ui/button";
import { useToast } from "mtxuilib/ui/use-toast";
import { useTenant, useTenantId } from "../../../hooks/useAuth";
import type { WorkflowRunShape } from "../../../types/hatchet-types";

interface RunDetailHeaderProps {
  data?: WorkflowRunShape;
  loading?: boolean;
  refetch: () => void;
}

export const WORKFLOW_RUN_TERMINAL_STATUSES = [
  WorkflowRunStatus.CANCELLED,
  WorkflowRunStatus.FAILED,
  WorkflowRunStatus.SUCCEEDED,
];

const RunDetailHeader: React.FC<RunDetailHeaderProps> = ({
  data,
  loading,
  refetch,
}) => {
  const tenant = useTenant();

  const { toast } = useToast();
  const tid = useTenantId();

  const cancelWorkflowRunMutation = useMutation({
    ...workflowRunCancelMutation(),
  });
  const replayWorkflowRunsMutation = useMutation({
    ...workflowRunUpdateReplayMutation(),
  });

  if (loading || !data) {
    return <div>加载中...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row justify-between items-center w-full">
          <div>
            <h2 className="text-2xl font-bold leading-tight text-foreground flex flex-row gap-4 items-center">
              <AdjustmentsHorizontalIcon className="w-5 h-5 mt-1" />
              {data?.displayName}
            </h2>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <a
              href={`/workflows/${data.workflowId}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button size={"sm"} className="px-2 py-2 gap-2" variant="outline">
                <ArrowTopRightIcon className="size-4" />
                工作流定义
              </Button>
            </a>
            <Button
              size={"sm"}
              className="px-2 py-2 gap-2"
              variant={"outline"}
              disabled={!WORKFLOW_RUN_TERMINAL_STATUSES.includes(data.status)}
              onClick={() => {
                replayWorkflowRunsMutation.mutate({
                  path: {
                    tenant: tenant!.metadata.id,
                  },

                  body: {
                    workflowRunIds: [data.metadata.id],
                  },
                });
              }}
            >
              <ArrowPathIcon className="size-4" />
              重试
            </Button>
            <Button
              size={"sm"}
              className="px-2 py-2 gap-2"
              variant={"outline"}
              disabled={WORKFLOW_RUN_TERMINAL_STATUSES.includes(data.status)}
              onClick={() => {
                cancelWorkflowRunMutation.mutate({
                  path: {
                    tenant: tid,
                  },
                  body: {
                    workflowRunIds: [data.metadata.id],
                  },
                });
              }}
            >
              <XCircleIcon className="size-4" />
              取消
            </Button>
          </div>
        </div>
      </div>
      {data.triggeredBy?.parentWorkflowRunId && (
        <TriggeringParentWorkflowRunSection
          tenantId={data.tenantId}
          parentWorkflowRunId={data.triggeredBy.parentWorkflowRunId}
        />
      )}
      {data.triggeredBy?.eventId && (
        <TriggeringEventSection eventId={data.triggeredBy.eventId} />
      )}
      {data.triggeredBy?.cronSchedule && (
        <TriggeringCronSection cron={data.triggeredBy.cronSchedule} />
      )}
      <div className="flex flex-row gap-2 items-center">
        <RunSummary data={data} />
      </div>
    </div>
  );
};

export default RunDetailHeader;

const RunSummary: React.FC<{ data: WorkflowRunShape }> = ({ data }) => {
  const timings: React.ReactNode[] = [];
  timings.push(
    <div key="created" className="text-sm text-muted-foreground">
      {"Created "}
      <RelativeDate date={data.metadata.createdAt} />
    </div>,
  );

  if (data.startedAt) {
    timings.push(
      <div key="started" className="text-sm text-muted-foreground">
        {"开始 "}
        <RelativeDate date={data.startedAt} />
      </div>,
    );
  } else {
    timings.push(
      <div key="running" className="text-sm text-muted-foreground">
        运行中
      </div>,
    );
  }

  if (data.status === WorkflowRunStatus.CANCELLED && data.finishedAt) {
    timings.push(
      <div key="cancelled" className="text-sm text-muted-foreground">
        已取消
        <RelativeDate date={data.finishedAt} />
      </div>,
    );
  }

  if (data.status === WorkflowRunStatus.FAILED && data.finishedAt) {
    timings.push(
      <div key="failed" className="text-sm text-muted-foreground">
        失败
        <RelativeDate date={data.finishedAt} />
      </div>,
    );
  }

  if (data.status === WorkflowRunStatus.SUCCEEDED && data.finishedAt) {
    timings.push(
      <div key="finished" className="text-sm text-muted-foreground">
        已完成
        <RelativeDate date={data.finishedAt} />
      </div>,
    );
  }

  if (data.duration) {
    timings.push(
      <div key="duration" className="text-sm text-muted-foreground">
        耗时 {formatDuration(data.duration)}
      </div>,
    );
  }

  // interleave the timings with a dot
  const interleavedTimings: React.ReactNode[] = [];

  timings.forEach((timing, index) => {
    interleavedTimings.push(timing);
    if (index < timings.length - 1) {
      interleavedTimings.push(
        <div
          key={`dot-${
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            index
          }`}
          className="text-sm text-muted-foreground"
        >
          |
        </div>,
      );
    }
  });

  return (
    <div className="flex flex-row gap-4 items-center">{interleavedTimings}</div>
  );
};

function TriggeringParentWorkflowRunSection({
  tenantId,
  parentWorkflowRunId,
}: {
  tenantId: string;
  parentWorkflowRunId: string;
}) {
  const workflowRunQuery = useQuery({
    ...workflowRunGetOptions({
      path: {
        tenant: tenantId,
        "workflow-run": parentWorkflowRunId,
      },
    }),
  });

  if (workflowRunQuery.isLoading || !workflowRunQuery.data) {
    return null;
  }

  const workflowRun = workflowRunQuery.data;

  return (
    <div className="text-sm text-gray-700 dark:text-gray-300 flex flex-row gap-1">
      Triggered by
      <CustomLink
        to={`/workflow-runs/${parentWorkflowRunId}`}
        className="font-semibold hover:underline  text-indigo-500 dark:text-indigo-200"
      >
        {workflowRun.displayName} ➶
      </CustomLink>
    </div>
  );
}

function TriggeringEventSection({ eventId }: { eventId: string }) {
  const eventData = useQuery({
    ...eventGetOptions({
      path: {
        event: eventId,
      },
    }),
  });

  if (eventData.isLoading || !eventData.data) {
    return null;
  }

  const event = eventData.data;

  return (
    <div className="text-sm text-gray-700 dark:text-gray-300 flex flex-row gap-1">
      触发事件 {event.key}
    </div>
  );
}

function TriggeringCronSection({ cron }: { cron: string }) {
  const prettyInterval = `runs ${CronPrettifier.toString(
    cron,
  ).toLowerCase()} UTC`;

  return (
    <div className="text-sm text-gray-700 dark:text-gray-300">
      定时任务 {cron} 每 {prettyInterval}
    </div>
  );
}
