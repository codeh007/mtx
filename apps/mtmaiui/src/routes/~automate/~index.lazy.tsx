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
  const runSandboxAgent = async (task: string) => {
    const response = await fetch("/api/sandbox/run/agent", {
      method: "POST",
      body: JSON.stringify({ task }),
    });
    const data = await response.json();
    console.log(data);
  };
  return (
    <Button onClick={() => runSandboxAgent("请自我介绍, 告诉我你的能力.")}>
      运行 python 并返回结果
    </Button>
  );
};
