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
              name: "123",
              input: {},
            },
          })
        }
      >
        运行工作流
      </Button>
    </div>
  );
}
