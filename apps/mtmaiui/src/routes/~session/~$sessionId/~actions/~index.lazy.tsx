import { createLazyFileRoute } from "@tanstack/react-router";
import { AgentEventType } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/session/$sessionId/actions/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <SocialLoginAction />
    </div>
  );
}

const SocialLoginAction = () => {
  const handleHumanInput = useWorkbenchStore((x) => x.handleHumanInput);
  return (
    <div>
      <h1>SocialLoginAction</h1>
      <Button
        onClick={() =>
          handleHumanInput({
            content: "你好",
            type: AgentEventType.AGENT_USER_INPUT,
            input: {
              type: AgentEventType.SOCIAL_ADD_FOLLOWERS_INPUT,
              count_to_follow: 1,
            },
          })
        }
      >
        确定
      </Button>
    </div>
  );
};
