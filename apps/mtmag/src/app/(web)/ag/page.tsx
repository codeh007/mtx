import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "../../../lib/get-query-client";

export default async function Page(props: { params }) {
  const queryClient = getQueryClient();
  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        AG 加载中...
      </HydrationBoundary>
    </>
  );
}
