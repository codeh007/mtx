import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { type PlatformAccount, platformAccountListOptions } from "mtmaiapi";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { buttonVariants } from "mtxuilib/ui/button";
import { useTenantId } from "../../hooks/useAuth";

export const Route = createLazyFileRoute("/platform-account/")({
  component: RouteComponent,
});

function RouteComponent() {
  const tid = useTenantId();
  const query = useSuspenseQuery({
    ...platformAccountListOptions({
      path: {
        tenant: tid,
      },
    }),
  });
  return (
    <div className="flex flex-col h-full w-full ">
      <div>
        <div>
          <CustomLink to="/platform-account/new" className={cn(buttonVariants())}>
            新建
          </CustomLink>
        </div>
      </div>

      <div>
        {/* 响应式列表视图 */}
        {query.data?.rows?.map((item) => (
          <PlatformAccountListItem key={item.metadata?.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function PlatformAccountListItem({ item }: { item: PlatformAccount }) {
  return <div>{item.metadata?.id}</div>;
}
