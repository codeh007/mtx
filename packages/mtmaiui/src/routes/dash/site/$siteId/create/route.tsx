import { createFileRoute } from "@tanstack/react-router";
import { SiteCreateView } from "../../../../../components/site/SiteCreate";

export const Route = createFileRoute("/dash/site/$siteId/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SiteCreateView />;
}
