import { createLazyFileRoute } from "@tanstack/react-router";
import { FlowNames, type FlowPlatformAccountInput } from "mtmaiapi";
import { ZForm, ZFormToolbar, useZodFormV2 } from "mtxuilib/mt/form/ZodForm";
import { z } from "zod";
import { useWorkflowRun } from "../../../hooks/useWorkflowRun";
import { SocialLoginFields } from "./SocialLoginFields";

export const Route = createLazyFileRoute("/platform-account/new/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { handleRun, workflowRunData, workflowRunMutation } = useWorkflowRun(
    FlowNames.PLATFORM_ACCOUNT,
    {
      username: "test",
      password: "test",
      platform_name: "test",
      two_factor_code: "test",
    } satisfies FlowPlatformAccountInput,
  );

  const form = useZodFormV2({
    toastValidateError: true,
    schema: z.object({
      username: z.string(),
      password: z.string(),
      two_factor_code: z.string(),
      platform_name: z.string(),
    }),
    defaultValues: {
      platform_name: "instagram",
    },
    handleSubmit: (data) => {
      workflowRunMutation.mutate({
        path: {
          workflow: FlowNames.PLATFORM_ACCOUNT,
        },
        body: {
          input: data,
        },
      });
    },
  });

  return (
    <>
      <ZForm {...form}>
        <SocialLoginFields />
      </ZForm>
      <ZFormToolbar {...form}>{/* <Button>Create</Button> */}</ZFormToolbar>
    </>
  );
}
