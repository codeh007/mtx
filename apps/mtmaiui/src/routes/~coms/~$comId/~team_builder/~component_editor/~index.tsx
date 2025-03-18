import { createFileRoute } from "@tanstack/react-router";
import { CustomLink } from "mtxuilib/mt/CustomLink";

export const Route = createFileRoute(
  "/coms/$comId/team_builder/component_editor/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      component_editor
      <div>
        <CustomLink to="/coms/$comId/team_builder/component_editor/component">
          component
        </CustomLink>
      </div>
    </div>
  );
}
