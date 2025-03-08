import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { type MtResource, resourceListOptions } from "mtmaiapi";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { buttonVariants } from "mtxuilib/ui/button";
import { useTenantId } from "../../hooks/useAuth";

export const Route = createLazyFileRoute("/resource/")({
  component: RouteComponent,
});

function RouteComponent() {
  const tid = useTenantId();
  const query = useSuspenseQuery({
    ...resourceListOptions({
      path: {
        tenant: tid,
      },
    }),
  });
  return (
    <div className="flex flex-col h-full w-full ">
      <div>
        <div>
          <CustomLink to="create" className={cn(buttonVariants())}>
            新建
          </CustomLink>
        </div>
      </div>

      <div>
        {/* 响应式列表视图 */}
        {query.data?.rows?.map((item) => (
          <ResourceListItem key={item.metadata?.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function ResourceListItem({ item }: { item: MtResource }) {
  return <div>{item.metadata?.id}</div>;
}
