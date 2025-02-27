"use client";

import { useQuery } from "@connectrpc/connect-query";

import { AgService } from "mtmaiapi/mtmclient/mtmai/mtmpb/ag_pb";
import { StreamExample1, StreamExample2 } from "./StreamExample1";
export default function ConnectQueryPage() {
  return (
    <>
      Connect Query Page
      <HelloConnectQuery />
      <StreamExample1 />
      <StreamExample2/>
    </>
  );
}

const HelloConnectQuery = () => {
  const query1 = useQuery(AgService.method.getComponent, {});
  return <div>{JSON.stringify(query1.data, null, 2)}</div>;
};
