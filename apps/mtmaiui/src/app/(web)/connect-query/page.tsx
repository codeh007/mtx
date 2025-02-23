"use client";

import { useQuery } from "@connectrpc/connect-query";

import { AgService } from "mtmaiapi/mtmclient/mtm/sppb/ag_pb";
import { StreamExample1 } from "./StreamExample1";
export default function ConnectQueryPage() {
  return (
    <>
      Connect Query Page
      <HelloConnectQuery />
      <StreamExample1 />
    </>
  );
}

const HelloConnectQuery = () => {
  const query1 = useQuery(AgService.method.teamGet, {});
  return <div>{JSON.stringify(query1.data, null, 2)}</div>;
};
