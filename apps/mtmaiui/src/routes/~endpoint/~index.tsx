import { createFileRoute } from "@tanstack/react-router";
import { Button } from "mtxuilib/ui/button.jsx";

export const Route = createFileRoute("/endpoint/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <HelloApiCall />
    </div>
  );
}

const HelloApiCall = () => {
  const endpointUrl = "https://mtmaiui.yuepa8.com/api/v1/agent/ag";
  const handleClick = async () => {
    const response = await fetch(endpointUrl);
    const data = await response.text();
    console.log(data);
  };
  return (
    <div>
      <Button onClick={handleClick}>HelloApiCall</Button>
    </div>
  );
};
