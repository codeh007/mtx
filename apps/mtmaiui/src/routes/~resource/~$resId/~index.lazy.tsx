import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "mtxuilib/ui/button";
import { useEffect } from "react";
import { useTenantId } from "../../../hooks/useAuth";
import { useNav } from "../../../hooks/useNav";
import { useWorkbenchStore } from "../../../stores/workbrench.store";
import { ChatClient } from "../../~play/~chat/chat/Chat.client";

export const Route = createLazyFileRoute("/resource/$resId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { resId } = Route.useParams();
  const tid = useTenantId();
  const nav = useNav();

  const setResourceId = useWorkbenchStore((x) => x.setResourceId);
  const resourceId = useWorkbenchStore((x) => x.resourceId);
  useEffect(() => {
    setResourceId(resId);
  }, [resId, setResourceId]);

  const handleHumanInput = useWorkbenchStore((x) => x.handleHumanInput);
  const handleRunWorkflow = () => {
    handleHumanInput({
      content: `这是用于社交媒体(Instagram)的的自动化任务,具体的账号数据,可以通过工具调用获取到,我希望结合团队的能力,完成这个任务,
具体的要求是:
1: 先诊断账号是否可用,方法是调用 browser 工具尝试登录instagram,如果登录成功,则账号可用,如果登录失败,则账号不可用,
2: 如果账号可用,则调用 browser 工具获取账号的详细信息,包括粉丝数,点赞数,评论数,发帖数,关注数,
3: 主动搜索相关主题的小博主,并关注他们,注意不要关注大博主.
`,
      resourceId: resId,
    });
  };

  const threadId = useWorkbenchStore((x) => x.threadId);
  useEffect(() => {
    if (threadId) {
      // handleRunWorkflow();
      console.log("threadId", threadId);
      nav({ to: `/resource/${resId}/${threadId}` });
    }
  }, [threadId]);

  return (
    <div>
      <div className="flex flex-row gap-2">
        <Button onClick={handleRunWorkflow}>运行</Button>
        resourceId:{resourceId}
      </div>
      <div>
        <ChatClient />
      </div>
    </div>
  );
}
