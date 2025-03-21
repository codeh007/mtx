import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { Button } from "mtxuilib/ui/button";
import { useMemo } from "react";
import { ModelWrapper } from "../../../../../stores/model.store";

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
    <ModelWrapper>
      <Button onClick={() => nav({ to: backLink })}>Back</Button>
    </ModelWrapper>
  );
}
