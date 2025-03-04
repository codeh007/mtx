"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useMtRouter } from "mtxuilib/hooks/use-router";
import { useMemo } from "react";
import { TaskListViewHeader } from "./TaskListViewHeader";

interface TaskListViewProps {
  siteId: string;
}
export const TaskListView = (props: TaskListViewProps) => {
  const { siteId } = props;

  const router = useMtRouter();

  const listQuery = useSuspenseQuery({
    // ...tasksTaskListOptions({
    //   body: {
    //     // ...searchParams,
    //     // dataType: "task",
    //     siteId,
    //   },
    // }),
  });
  const isEmpty = useMemo(() => {
    return listQuery.data?.data.length === 0;
  }, [listQuery.data?.data]);

  return (
    <>
      <div className="flex flex-col h-full w-full ">
        {isEmpty ? (
          <ListViewEmpty
            message="没有可用数据"
            linkToCreate="/dash/site/${siteId}/tasks/new"
          />
        ) : (
          <>
            <TaskListViewHeader />
            {/* {listQuery.data?.data.map((item) => (
              <TaskListViewItem
                key={item.id}
                item={item}
                // onItemClick={() => router.push(`/dash/site/${item.site_id}`)}
              />
            ))} */}
          </>
        )}
      </div>
    </>
  );
};
