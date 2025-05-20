import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "mtxuilib/ui/button";

export const Route = createLazyFileRoute("/automate/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <ButtonRun1 />
    </div>
  );
}

const ButtonRun1 = () => {
  return <Button>运行 python 并返回结果</Button>;
};
