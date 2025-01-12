import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "mtmaiui/stores/get-query-client";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
// import { HelloXLz } from "../../componenets/HelloXLz";
// import { useSuspenseQuery } from "@tanstack/react-query";
// import { postListOptions } from "mtmaiapi";
import { HelloXLz } from "../../components/HelloXLz";

export default async function Page(props: { params }) {
  const queryClient = getQueryClient();

  // const postQuery = useSuspenseQuery({
  //   ...postListOptions({}),
  // });
  return (
    <>
      <HelloXLz />
      aaaaa page
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
