"use client";

import { useQuery } from "@connectrpc/connect-query";
import { teamGet } from "mtmaiapi/mtmclient/mtm/sppb/ag-AgService_connectquery";
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
  const query1 = useQuery(teamGet, {});
  return <div>{JSON.stringify(query1.data, null, 2)}</div>;
};
