import { App } from "../../App";

export default async function Page(props: { params }) {
  // const queryClient = getQueryClient();
  return (
    <>
      {/* <HydrationBoundary state={dehydrate(queryClient)}>
        <div id="page-actions" />
      </HydrationBoundary> */}
      <App />
    </>
  );
}
