"use client";
import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { AgService } from "mtmaiapi/mtmclient/mtm/sppb/ag_pb";
import { Button } from "mtxuilib/ui/button";

export const StreamExample1 = () => {
  const handleClient = async () => {
    const transport = createConnectTransport({
      baseUrl: "https://colab-gomtm.yuepa8.com",
    });

    // Here we make the client itself, combining the service
    // definition with the transport.
    const client = createClient(AgService, transport);
    const stream = client.greet2({ name: "world" });
    for await (const response of stream) {
      console.log("Received greeting:", response.greeting);
    }
  };
  return (
    <div>
      <Button onClick={handleClient}>StreamExample1</Button>
    </div>
  );
};
