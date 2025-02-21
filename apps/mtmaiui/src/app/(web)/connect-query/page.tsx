"use client";

import { useQuery } from "@connectrpc/connect-query";

import { AgService } from "mtmaiapi/mtmclient/mtm/sppb/ag_pb";
import { MtTransportProvider } from "../../../stores/TransportProvider";
export default function ConnectQueryPage() {
  return (
    <MtTransportProvider>
      Connect Query Page
      <HelloConnectQuery />
    </MtTransportProvider>
  );
}

const HelloConnectQuery = () => {
  const query1 = useQuery(AgService.method.teamGet, {});
  return <div>{JSON.stringify(query1.data, null, 2)}</div>;
};
