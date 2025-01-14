import { createFileRoute } from "@tanstack/react-router";
import { SiteEditor } from "../../../components/site/SiteEditor";
import { useTenant } from "../../../hooks/useAuth";

export const Route = createFileRoute("/dash/site/$siteId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { siteId } = Route.useParams();
  const tenant = useTenant();
  if (!tenant) {
    return null;
  }
  return (
    <div>
      <SiteEditor siteId={siteId} />
    </div>
  );
}
