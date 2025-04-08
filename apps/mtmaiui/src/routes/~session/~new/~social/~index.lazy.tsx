import { createLazyFileRoute } from "@tanstack/react-router";
import { AgentEventType } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/session/new/social/")({
  component: RouteComponent,
});

function RouteComponent() {
  const handleHumanInput = useWorkbenchStore((x) => x.handleHumanInput);

  const handleSubmit = () => {
    handleHumanInput({
      type: AgentEventType.CHAT_MESSAGE_INPUT,
      content: "你好",
    });
  };

  return (
    <div>
      <h1>新建社交媒体会话</h1>

      <Button onClick={handleSubmit}>确定</Button>
    </div>
  );
}
