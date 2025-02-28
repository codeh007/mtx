import { Dispatcher } from "mtmaiapi/mtmclient/mtmai/mtmpb/dispatcher_pb";
import { Button } from "mtxuilib/ui/button";
import { useState } from "react";
import { useGomtmClient } from "../../stores/TransportProvider";

interface SubscribeWorkflowEventsProps {
  workflowRunId: string;
}
export const SubscribeWorkflowEvents = ({
  workflowRunId,
}: SubscribeWorkflowEventsProps) => {
  const client = useGomtmClient(Dispatcher);

  const [results, setResults] = useState<string[]>([]);
  const handleClient = async () => {
    const stream = client.subscribeToWorkflowEvents({
      workflowRunId: workflowRunId,
    });
    for await (const response of stream) {
      console.log("Received dispatcher:", response);
    }
  };
  return (
    <div>
      <Button onClick={handleClient}>SubscribeWorkflowEvents</Button>
      <div>
        {results.map((result, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <div key={index}>{result}</div>
        ))}
      </div>
    </div>
  );
};
