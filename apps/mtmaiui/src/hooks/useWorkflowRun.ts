"use client";

import { useQuery } from "@tanstack/react-query";
import { workflowRunGetShapeOptions } from "mtmaiapi";
import { useTenantId } from "./useAuth";
export const useWorkflowRunShape = (runId: string) => {
  // const mtmapi = useMtmClient();
  // const tenant = useTenant();
  const tid = useTenantId();
  // const [errors, setErrors] = useState<string[]>([]);
  // const shape = mtmapi.useQuery(
  //   "get",
  //   "/api/v1/tenants/{tenant}/workflow-runs/{workflow-run}/shape",
  //   {
  //     params: {
  //       path: {
  //         tenant: tenant!.metadata.id,
  //         "workflow-run": runId,
  //       },
  //     },
  //   },
  //   {
  //     refetchInterval: 2000,
  //   },
  // );
  const shape = useQuery({
    ...workflowRunGetShapeOptions({
      path:{
        tenant: tid,
        "workflow-run": runId,
      }
    }),
    refetchInterval: 2000,
  });
  return { shape };
};
