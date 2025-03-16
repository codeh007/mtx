import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { FlowNames, workflowRunCreateMutation } from "mtmaiapi";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { Button } from "mtxuilib/ui/button";
import { DashHeaders } from "../../components/DashHeaders";

export const Route = createLazyFileRoute("/tenant_settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  const mutateWorkflowRun = useMutation({
    ...workflowRunCreateMutation({}),
  });
  const handleResetTenandSetting = () => {
    console.log("handleResetTenandSetting", FlowNames.TENANT_SETTINGS);
    mutateWorkflowRun.mutateAsync({
      path: {
        workflow: FlowNames.TENANT_SETTINGS,
      },
      body: {
        input: {
          content: "重置租户配置",
        },
        additionalMetadata: {
          source: "web",
          // topic: "default",
          // componentId: "tenant_settings",
        },
      },
    });
  };
  return (
    <>
      <DashHeaders>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>租户设置</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </DashHeaders>
      <div className="flex flex-col h-full w-full px-2">
        <Button onClick={handleResetTenandSetting}>重置租户配置</Button>
      </div>
      <div className="flex flex-col h-full w-full px-2">
        <CustomLink to={"model_client_settings"}>模型客户端设置</CustomLink>
      </div>
    </>
  );
}
