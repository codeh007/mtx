"use client";

import { CustomLink } from "mtxuilib/mt/CustomLink.jsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "mtxuilib/ui/breadcrumb.jsx";
import { Button } from "mtxuilib/ui/button";
import {
  DashHeaders,
  HeaderActionConainer,
} from "../../../../components/DashHeaders";
import { useTeamSessionStore } from "../../../../stores/teamSessionProvider";

interface TeamSessionHeaderProps {
  componentId: string;
}
export const TeamSessionHeader = ({ componentId }: TeamSessionHeaderProps) => {
  const runComponent = useTeamSessionStore((x) => x.runComponent);
  return (
    <DashHeaders>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <CustomLink to={`/coms/${componentId}/view`}>组件</CustomLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>新任务</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <HeaderActionConainer>
        <Button onClick={() => runComponent()}>立即运行</Button>
      </HeaderActionConainer>
    </DashHeaders>
  );
};
