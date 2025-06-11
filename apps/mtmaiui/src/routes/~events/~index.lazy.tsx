import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { eventPushMutation } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";

export const Route = createLazyFileRoute("/events/")({
  component: RouteComponent,
});

function RouteComponent() {
  const eventPush = useMutation({
    ...eventPushMutation(),
  });
  return (
    <div>
      <Button
        onClick={() =>
          eventPush.mutate({
            body: {
              key: "123",
              input: {},
              additionalMetadata: {},
            },
          })
        }
      >
        测试：推送事件(触发工作流的运行)
      </Button>
    </div>
  );
}
