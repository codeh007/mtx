import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useWorkbenchStore } from "../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/resource/$resId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { resId } = Route.useParams();
  // const tenant = useTenant();
  // if (!tenant) {
  //   null;
  // }
  // const selfBackendend = useMtmaiV2((x) => x.selfBackendUrl);
  // if (!selfBackendend) {
  //   null;
  // }
  const setResourceId = useWorkbenchStore((x) => x.setResourceId);
  const resourceId = useWorkbenchStore((x) => x.resourceId);
  useEffect(() => {
    setResourceId(resId);
  }, [resId, setResourceId]);
  return (
    <>
      {/* resourceId:{resourceId} */}
      <Outlet />
    </>
  );
}
