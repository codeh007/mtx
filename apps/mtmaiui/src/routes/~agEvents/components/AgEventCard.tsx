"use client";
import type { AgEvent } from "mtmaiapi";
import { RelativeDate } from "mtxuilib/mt/relative-date";
import { Button } from "mtxuilib/ui/button";
import { CustomLink } from "../../../components/CustomLink";

interface AgEventCardProps {
  data: AgEvent;
}
export const AgEventCard = ({ data }: AgEventCardProps) => {
  return (
    <div
      key={data.metadata?.id}
      className="border overflow-hidden shadow-sm rounded-lg"
    >
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-foreground">
            <CustomLink
              to={`/agEvents/${data?.metadata?.id}`}
              className="hover:underline"
            >
              {data?.userId}
            </CustomLink>
          </h3>
          {/* {data?.isPaused ? (
            <Badge variant="inProgress">Paused</Badge>
          ) : (
            <Badge variant="successful">Active</Badge>
          )} */}
        </div>
        <p className="mt-1 max-w-2xl text-sm text-gray-700 dark:text-gray-300">
          {/* Last run{' '}
        {data.lastRunAt ? <RelativeDate date={data.lastRunAt} /> : 'never'}
        <br /> */}
          Created at <RelativeDate date={data?.metadata?.createdAt} />
        </p>
      </div>
      <div className="px-4 py-4 sm:px-6">
        <div className="text-sm text-background-secondary">
          <CustomLink to={`/agEvents/${data?.metadata?.id}`}>
            <Button>View Post</Button>
          </CustomLink>
        </div>
      </div>
    </div>
  );
};
