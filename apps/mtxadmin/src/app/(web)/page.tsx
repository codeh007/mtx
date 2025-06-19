import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { HelloXLz } from "../../componenets/HelloXLz";

export default async function Page(props: { params }) {
  return (
    <>
      <HelloXLz />
      <MtSuspenseBoundary>
        {/* <PokemonInfo /> */}
        {/* <PostListViewPublic /> */}
        {/* <ExternalAppContainer /> */}
      </MtSuspenseBoundary>
    </>
  );
}
