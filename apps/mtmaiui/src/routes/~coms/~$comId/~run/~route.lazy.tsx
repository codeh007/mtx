import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { buttonVariants } from "mtxuilib/ui/button";
import { DashHeaders } from "../../../../components/DashHeaders";

export const Route = createLazyFileRoute("/coms/$comId/run")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <DashHeaders>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <CustomLink
                to={".."}
                className={cn(buttonVariants({ variant: "ghost" }))}
              >
                返回
              </CustomLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>运行记录</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </DashHeaders>
      <Outlet />
    </>
  );
}
