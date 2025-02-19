"use client";

import { useQuery } from "@tanstack/react-query";
import { workflowRunGetOptions, workflowRunGetShapeOptions } from "mtmaiapi";
import { useTenantId } from "./useAuth";
export const useWorkflowRunShape = (runId: string) => {
  const tid = useTenantId();
  const shape = useQuery({
    ...workflowRunGetShapeOptions({
      path:{
        tenant: tid,
        "workflow-run": runId,
      }
    }),
    refetchInterval: 2000,
  });

  //原因: 后端的 shape 没有 jobRuns 字段,(因递归问题)
  //     这里通过二次查询获取这个字段
  // const stepRuns = useQuery({
  //   ...workflowRunGetOptions({
  //     path: {
  //       tenant: tid,
  //       "workflow-run": runId,
  //     },
  //   }),
  // });
  // if(shape.data && stepRuns.data!.jobRuns){
  //   shape.data!.jobRuns = stepRuns.data!.jobRuns
  // }
  return { shape };
};
