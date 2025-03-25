import { createLazyFileRoute } from "@tanstack/react-router";
import { generateUUID } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { useTenantId } from "../../hooks/useAuth";

export const Route = createLazyFileRoute("/resource/")({
  component: RouteComponent,
});

function RouteComponent() {
  const tid = useTenantId();
  // const query = useSuspenseQuery({
  //   ...resourceListOptions({
  //     path: {
  //       tenant: tid,
  //     },
  //   }),
  // });

  const newId = generateUUID();
  return (
    <div className="flex flex-col h-full w-full p-2">
      <CustomLink to={`/resource/${newId}/platform_account`}>
        新建ig账号
      </CustomLink>
      <div>
        {/* {query.data?.rows?.map((item) => (
          <ResourceListItem key={item.metadata?.id} item={item} />
        ))} */}
      </div>
    </div>
  );
}
