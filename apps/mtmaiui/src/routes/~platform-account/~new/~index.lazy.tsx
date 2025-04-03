import { createLazyFileRoute } from "@tanstack/react-router";
import { FlowNames, type FlowPlatformAccountInput } from "mtmaiapi";
import { zFlowPlatformAccountInput } from "mtmaiapi/gomtmapi/zod.gen";
import { ZForm, ZFormToolbar, useZodFormV2 } from "mtxuilib/mt/form/ZodForm";
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
    schema: zFlowPlatformAccountInput,
    defaultValues: {
      platform_name: "instagram",
      username: "saibichquyenll2015",
      password: "",
      proxy_url: "http://localhost:10809",
      // two_factor_code: "",
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
