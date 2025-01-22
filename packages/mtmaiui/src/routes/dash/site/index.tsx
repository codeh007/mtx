import { createFileRoute } from "@tanstack/react-router";
import SiteListView from "../../../components/site/SiteListView";

export const Route = createFileRoute("/dash/site/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <SiteListView />
    </>
  );
}
