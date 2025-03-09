import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { type MtResource, resourceListOptions } from "mtmaiapi";
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
    <div className="flex flex-col h-full w-full p-2">
      <div>
        {query.data?.rows?.map((item) => (
          <ResourceListItem key={item.metadata?.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function ResourceListItem({ item }: { item: MtResource }) {
  return <div className="flex bg-slate-50 p-2">{item.metadata?.id}</div>;
}
