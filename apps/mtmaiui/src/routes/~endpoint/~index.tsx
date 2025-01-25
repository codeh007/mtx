import { createFileRoute } from "@tanstack/react-router";
import { Button } from "mtxuilib/ui/button";
import { useState } from "react";

export const Route = createFileRoute("/endpoint/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <TestApiGateway />
    </div>
  );
}

const TestApiGateway = () => {
  const [responseText, setResponseText] = useState("");
  const endpointUrl = "https://mtmaiui.yuepa8.com/api/v1/agent/ag";
  const handleClick = async () => {
    const response = await fetch(endpointUrl);
    const data = await response.text();
    setResponseText(data);
  };
  return (
    <div>
      <Button onClick={handleClick}>TestApiGateway</Button>
      <div>{responseText}</div>
    </div>
  );
};
