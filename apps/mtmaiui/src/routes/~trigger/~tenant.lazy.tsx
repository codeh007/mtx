"use client";
import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { workflowRunCreateMutation } from "mtmaiapi";
// import { agentRunMutation } from 'mtmaiapi'
import { Button } from "mtxuilib/ui/button";
import { useState } from "react";
import { useApiError } from "../../hooks/useApi";
import { useTenant } from "../../hooks/useAuth";
export const Route = createLazyFileRoute("/trigger/tenant")({
  component: RouteComponent,
});

function RouteComponent() {
  const tenant = useTenant();
  const [errors, setErrors] = useState<string[]>([]);

  const { handleApiError } = useApiError({
    setErrors,
  });
  const triggerWorkflowMutation = useMutation({
    ...workflowRunCreateMutation(),
    onSuccess: (data) => {
      // navigate({
      //   to: `/workflow-runs/${data.metadata.id}`,
      //   params: {
      //     workflowRunId: data.metadata.id,
      //   },
      // })
    },
    onError: handleApiError,
    onMutate: () => {
      // setErrors([])
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <h1>重置 tenant 数据</h1>
      <Button
        disabled={triggerWorkflowMutation.isPending}
        onClick={() =>
          triggerWorkflowMutation.mutate({
            path: {
              // tenant: tenant!.metadata.id,
              workflow: "tenant",
            },
            // body: { name: "tenant", isStream: false, params: {} },
            body: {
              input: {},
              additionalMetadata: {},
            },
          })
        }
      >
        提交
      </Button>
    </div>
  );
}
