import { useTenantId } from "@mtmaiui/hooks/useAuth";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { sandboxGetOptions } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";

export const Route = createLazyFileRoute("/sandbox/$sandboxId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sandboxId } = Route.useParams();
  const tid = useTenantId();
  return (
    <>
      <SandboxView tid={tid} sandboxId={sandboxId} />
    </>
  );
}

const SandboxView = ({ tid, sandboxId }: { tid: string; sandboxId: string }) => {
  const sandboxGetQuery = useSuspenseQuery({
    ...sandboxGetOptions({
      // path:{
      //   // ten
      // }
    }),
  });
  if (sandboxGetQuery.data?.type === "adk") {
    return <SandBoxViewAdk />;
  }
  return (
    <div className="flex flex-col gap-4 bg-red-500">
      <DebugValue data={sandboxGetQuery.data} />
      unknown sandbox type
    </div>
  );
};

const SandBoxViewAdk = () => {
  return (
    <div className="flex flex-col gap-4 bg-blue-500">
      <div>
        <div>
          <div>SandBoxViewAdk</div>
        </div>
      </div>
    </div>
  );
};
