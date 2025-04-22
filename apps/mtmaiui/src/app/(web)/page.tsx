"use client";
import { MtmClientApp } from "../../App";

export default async function Page(props: { params }) {
  // const queryClient = getQueryClient();
  return (
    <>
      home page
      {/* <HydrationBoundary state={dehydrate(queryClient)}>
        <div id="page-actions" />
      </HydrationBoundary> */}
      <MtmClientApp />
    </>
  );
}
