import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { adminReleaseConnMutation, adminResetDbMutation } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import { useToast } from "mtxuilib/ui/use-toast";

export const Route = createLazyFileRoute("/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-2 mx-auto p-2">
      <ReleaseDbConnectionsButton />
      <CleanDbTablesButton />
    </div>
  );
}

const ReleaseDbConnectionsButton = () => {
  const toast = useToast();

  const adminReleaseConn = useMutation({
    ...adminReleaseConnMutation(),
    onSuccess: () => {
      toast.toast({
        title: "释放数据库连接成功",
      });
    },
  });
  return (
    <Button
      onClick={() =>
        adminReleaseConn.mutate({
          // comId: "123",
        })
      }
    >
      释放数据库连接
    </Button>
  );
};

const CleanDbTablesButton = () => {
  const toast = useToast();
  const adminResetDb = useMutation({
    ...adminResetDbMutation(),
    onSuccess: () => {
      toast.toast({
        title: "清理数据库表成功",
      });
    },
  });
  return (
    <Button
      onClick={() =>
        adminResetDb.mutate({
          // comId: "123",
        })
      }
    >
      清理数据库表
    </Button>
  );
};
