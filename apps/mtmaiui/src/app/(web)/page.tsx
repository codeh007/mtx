import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { getQueryClient } from "../../lib/get-query-client";
// import { PostListViewPublic } from "../../routes/~post/components/PostListPublicView";

export default async function Page(props: { params }) {
  const queryClient = getQueryClient();
  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div id="page-actions" />
        <MtSuspenseBoundary>{/* <PostListViewPublic /> */}</MtSuspenseBoundary>
      </HydrationBoundary>
    </>
  );
}
