import { createLazyFileRoute } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { DashHeaders } from "../../../components/DashHeaders";

export const Route = createLazyFileRoute(
  "/tenant_settings/model_client_settings",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <DashHeaders>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>模型客户端设置</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </DashHeaders>
    </>
  );
}
