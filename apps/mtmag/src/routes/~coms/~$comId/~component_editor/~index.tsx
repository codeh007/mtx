import { createFileRoute } from "@tanstack/react-router";
import { CustomLink } from "mtxuilib/mt/CustomLink";

export const Route = createFileRoute("/coms/$comId/component_editor/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <CustomLink to="/coms/$comId/team_builder/component_editor/component">
        component
      </CustomLink>
    </div>
  );
}
