import { Dispatcher } from "mtmaiapi/mtmclient/mtmai/mtmpb/dispatcher_pb";
import { Button } from "mtxuilib/ui/button";
import { useState } from "react";
import { useGomtmClient } from "../../stores/TransportProvider";

export const SubscribeWorkflowEvents = () => {
  const client = useGomtmClient(Dispatcher);

  const [results, setResults] = useState<string[]>([]);
  const handleClient = async () => {
    const stream = client.subscribeToWorkflowEvents({
      // workerId: "123",
      // workflowId: "123",
      workflowRunId: "123",
    });
    for await (const response of stream) {
      console.log("Received dispatcher:", response);
    }
  };
  return (
    <div>
      <Button onClick={handleClient}>StreamExample2</Button>
      <div>
        {results.map((result, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <div key={index}>{result}</div>
        ))}
      </div>
    </div>
  );
};
