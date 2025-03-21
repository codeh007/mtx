import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  ModelContent,
  ModelHeader,
  ModelTitle,
  MtModal,
} from "../../../../../stores/model.store";

export const Route = createFileRoute(
  "/coms/$comId/team_builder/component_editor/SmolaAgent",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const nav = Route.useNavigate();
  const r = useRouterState();

  const backLink = useMemo(() => {
    return { to: "/coms/$comId" };
  }, []);

  return (
    <MtModal>
      <ModelContent>
        <ModelHeader>
          <ModelTitle>title</ModelTitle>
        </ModelHeader>
        <div>content</div>
      </ModelContent>
    </MtModal>
  );
}
