import { useTenantId } from "@mtmaiui/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { singboxImportOutboundsMutation } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import { toast } from "sonner";

export const Route = createLazyFileRoute("/singbox/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <ImportView />
    </div>
  );
}

const ImportView = () => {
  const tid = useTenantId();
  const sbImportMutation = useMutation({
    ...singboxImportOutboundsMutation(),
    onSuccess: () => {
      toast.success("导入成功");
    },
  });
  return (
    <div>
      <Button
        onClick={() =>
          sbImportMutation.mutate({
            body: {
              url: "",
            },
          })
        }
      >
        导入
      </Button>
    </div>
  );
};
