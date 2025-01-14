import { createLazyFileRoute } from "@tanstack/react-router";

import SiteListView from "../../../components/site/SiteListView";
import { useTenant } from "../../../hooks/useAuth";

export const Route = createLazyFileRoute("/dash/site/")({
  component: RouteComponent,
});

function RouteComponent() {
  const tenant = useTenant();
  if (!tenant) {
    return null;
  }
  return (
    <>
      <SiteListView />
    </>
  );
}
