import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/platform-account/new/")({
  component: RouteComponent,
});

function RouteComponent() {
  // const { handleRun, workflowRunData, workflowRunMutation } = useWorkflowRun(
  //   FlowNames.PLATFORM_ACCOUNT_LOGIN,
  //   {},
  // );

  // const form = useZodFormV2({
  //   toastValidateError: true,
  //   schema: zFlowPlatformAccountLoginInput,
  //   defaultValues: {
  //     platform_name: "instagram",
  //     username: "saibichquyenll2015",
  //     password: "",
  //     proxy_url: "http://localhost:10809",
  //   },
  //   handleSubmit: (data) => {
  //     workflowRunMutation.mutate({
  //       path: {
  //         workflow: FlowNames.PLATFORM_ACCOUNT_LOGIN,
  //       },
  //       body: {
  //         input: data,
  //       },
  //     });
  //   },
  // });

  return (
    <>
      {/* <ZForm {...form}>
        <SocialLoginFields />
      </ZForm>
      <ZFormToolbar {...form} /> */}
    </>
  );
}
