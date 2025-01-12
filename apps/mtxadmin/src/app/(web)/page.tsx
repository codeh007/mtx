import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "mtmaiui/stores/get-query-client";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { HelloXLz } from "../../componenets/HelloXLz";

export default async function Page(props: { params }) {
  const queryClient = getQueryClient();
  // 解释: void 表示我知道是异步,但是我故意不用等待.11
  // void queryClient.prefetchQuery(pokemonOptions);

  return (
    <>
      <HelloXLz />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MtSuspenseBoundary>
          {/* <PokemonInfo /> */}
          {/* <PostListViewPublic /> */}
          {/* <ExternalAppContainer /> */}
        </MtSuspenseBoundary>
      </HydrationBoundary>
    </>
  );
}
