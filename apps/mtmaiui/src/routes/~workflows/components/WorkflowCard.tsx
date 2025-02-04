"use client";

import type { Workflow } from "mtmaiapi";
import { RelativeDate } from "mtxuilib/mt/relative-date";
import { Badge } from "mtxuilib/ui/badge";
import { Button } from "mtxuilib/ui/button";
import { CustomLink } from "../../../components/CustomLink";
import { useBasePath } from "../../../hooks/useBasePath";
import { WorkflowTriggerBtn } from "./WorkflowTriggerBtn";

export const WorkflowCard = ({ data }: { data: Workflow }) => {
  return (
    <div
      key={data.metadata?.id}
      className="border overflow-hidden shadow rounded-lg"
    >
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-foreground">
            <CustomLink to={`/workflows/${data.metadata?.id}`}>
              {data.name}
            </CustomLink>
          </h3>
          {data.isPaused ? (
            <Badge variant="inProgress">Paused</Badge>
          ) : (
            <Badge variant="successful">Active</Badge>
          )}
        </div>
        <p className="mt-1 max-w-2xl text-sm text-gray-700 dark:text-gray-300">
          {/* Last run{' '}
      {data.lastRunAt ? <RelativeDate date={data.lastRunAt} /> : 'never'}
      <br /> */}
          Created at <RelativeDate date={data.metadata?.createdAt} />
        </p>
      </div>
      <div className="px-4 py-4 sm:px-6">
        <div className="text-sm text-background-secondary gap-2 flex flex-row">
          <CustomLink to={`/workflows/${data.metadata?.id}`}>
            <Button>View</Button>
          </CustomLink>
          <WorkflowTriggerBtn workflowId={data.metadata.id} />
        </div>
      </div>
    </div>
  );
};
