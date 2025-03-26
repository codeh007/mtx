import { createLazyFileRoute } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { DashHeaders } from "../../../../components/DashContent";
import { FormInstagramTeam } from "../../components/form_instagram_team";

export const Route = createLazyFileRoute("/coms/$comId/type/instagramTeam")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <DashHeaders>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>编辑 instagram 团队</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </DashHeaders>
      <FormInstagramTeam />
    </>
  );
}
