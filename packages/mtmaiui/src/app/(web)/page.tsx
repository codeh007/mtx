import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "mtmaiui/stores/get-query-client";
import { PostListViewPublic } from "../../components/post/PostListPublicView";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";

export default async function Page(props: { params }) {
  const queryClient = getQueryClient();
  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
          {/* <div>home</div> */}
          {/* <PokemonInfo /> */}

          <MtSuspenseBoundary>
            <PostListViewPublic />
          </MtSuspenseBoundary>
      </HydrationBoundary>
    </>
  );
}
