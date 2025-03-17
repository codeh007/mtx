"use client";

import { CustomLink } from "mtxuilib/mt/CustomLink";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "mtxuilib/ui/breadcrumb";
import { Button } from "mtxuilib/ui/button";
import {
  DashHeaders,
  HeaderActionConainer,
} from "../../../../components/DashHeaders";
import { useTeamSessionStore } from "../../../../stores/teamSessionProvider";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";

interface TeamSessionHeaderProps {
  componentId: string;
}
export const TeamSessionHeader = ({ componentId }: TeamSessionHeaderProps) => {
  const runComponent = useTeamSessionStore((x) => x.runComponent);
  const handleHumanInput = useWorkbenchStore((x) => x.handleHumanInput);

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
        <Button
          onClick={() => {
            handleHumanInput({
              content: "你好",
              componentId: componentId,
            });
          }}
        >
          立即运行
        </Button>
      </HeaderActionConainer>
    </DashHeaders>
  );
};
