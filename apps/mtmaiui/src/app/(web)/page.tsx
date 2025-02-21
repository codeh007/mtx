import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "mtmaiui/stores/get-query-client";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
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
