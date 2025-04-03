"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { type Proxy as MtProxy, proxyListOptions } from "mtmaiapi";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { TaskDateBadge } from "mtxuilib/mt/relative-date";
import { buttonVariants } from "mtxuilib/ui/button";
import { useTenantId } from "../../hooks/useAuth";

export function ProxyListView() {
  const tid = useTenantId();
  const listProxyQuery = useSuspenseQuery({
    ...proxyListOptions({
      path: {
        tenant: tid,
      },
    }),
  });
  return (
    <div>
      {listProxyQuery.data?.rows?.map((row) => (
        <ProxyListItem key={row.metadata.id} row={row} />
      ))}
    </div>
  );
}

function ProxyListItem({ row }: { row: MtProxy }) {
  const proxyId = row.metadata.id;
  const proxyName = row.name;
  return (
    <div className="flex flex-col gap-2 mb-2 bg-blue-50 p-2 rounded-md">
      <div>
        <CustomLink to={`/proxy/${row.metadata.id}`}>{row.name}</CustomLink>
      </div>

      <div>
        <TaskDateBadge
          date_created_at={row.metadata.createdAt}
          date_updated_at={row.metadata.updatedAt}
        />
        <span className="text-sm text-muted-foreground">{row.name}</span>
        <span>
          <CustomLink
            to={`/proxy/${proxyId}/trigger/${proxyName}`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            启动
          </CustomLink>
        </span>
        {/* <span>
          <CustomLink
            to={`/workflows/${workflowId}/trigger/${workflowName}`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            删除
          </CustomLink>
        </span> */}
      </div>
    </div>
  );
}
