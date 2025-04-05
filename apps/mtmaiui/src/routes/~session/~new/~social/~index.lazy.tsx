import { createLazyFileRoute } from "@tanstack/react-router";
import { AgentEventType } from "mtmaiapi/gomtmapi/types.gen";
import { Button } from "mtxuilib/ui/button";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/session/new/social/")({
  component: RouteComponent,
});

function RouteComponent() {
  const handleHumanInput = useWorkbenchStore((x) => x.handleHumanInput);

  const handleSubmit = () => {
    console.log("确定");
    handleHumanInput({
      type: AgentEventType.AGENT_USER_INPUT,
      content: "abc",
      componentId: "social",
    });
  };

  return (
    <div>
      <h1>新建社交媒体会话</h1>

      <Button onClick={handleSubmit}>确定</Button>
    </div>
  );
}
