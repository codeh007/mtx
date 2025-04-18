"use client";

import { useQuery } from "@connectrpc/connect-query";

import { AgService } from "mtmaiapi/mtmclient/mtmai/mtmpb/ag_pb";
import { StreamExample1 } from "./StreamExample1";
export default function ConnectQueryPage() {
  return (
    <>
      <HelloConnectQuery />
      <StreamExample1 />
    </>
  );
}

const HelloConnectQuery = () => {
  const query1 = useQuery(AgService.method.getComponent, {});
  return <div>{JSON.stringify(query1.data, null, 2)}</div>;
};
