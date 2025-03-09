import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { useTenant } from "../../../hooks/useAuth";
import { useMtmaiV2 } from "../../../stores/StoreProvider";

export const Route = createLazyFileRoute("/resource/$resId")({
  component: RouteComponent,
});

function RouteComponent() {
  const tenant = useTenant();
  if (!tenant) {
    null;
  }
  const selfBackendend = useMtmaiV2((x) => x.selfBackendUrl);
  if (!selfBackendend) {
    null;
  }
  return (
    <>
      <Outlet />
    </>
  );
}
