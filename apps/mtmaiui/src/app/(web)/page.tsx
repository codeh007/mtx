"use client";
import { MtmClientApp } from "../../App";

export default function Page(props: { params }) {
  // const queryClient = getQueryClient();
  return (
    <>
      {/* <HydrationBoundary state={dehydrate(queryClient)}>
        <div id="page-actions" />
      </HydrationBoundary> */}
      <MtmClientApp />
    </>
  );
}
