"use client";
import { AgService } from "mtmaiapi/mtmclient/mtmai/mtmpb/ag_pb";
import { Dispatcher } from "mtmaiapi/mtmclient/mtmai/mtmpb/dispatcher_pb";
import { Button } from "mtxuilib/ui/button";
import { useState } from "react";
import { useGomtmClient } from "../../../stores/TransportProvider";

export const StreamExample1 = () => {
  const client = useGomtmClient(AgService);

  const [results, setResults] = useState<string[]>([]);
  const handleClient = async () => {
    const stream = client.greet2({ name: "world" });
    for await (const response of stream) {
      console.log("Received greeting:", response.greeting);
      setResults((pre) => [...pre, response.greeting]);
    }
  };
  return (
    <div>
      <Button onClick={handleClient}>StreamExample1</Button>
      <div>
        {results.map((result, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <div key={index}>{result}</div>
        ))}
      </div>
    </div>
  );
};

export const StreamExample2 = () => {
  const client = useGomtmClient(Dispatcher);

  const [results, setResults] = useState<string[]>([]);
  const handleClient = async () => {
    const stream = client.listenV2({
      workerId: "123",
      // workflowId: "123",
      // runId: "123",
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
