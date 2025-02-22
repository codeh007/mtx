"use client";
import { AgService } from "mtmaiapi/mtmclient/mtm/sppb/ag_pb";
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
