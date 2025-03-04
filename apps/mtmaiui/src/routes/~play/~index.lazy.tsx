import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { Team } from "../../types/datamodel";

export const Route = createLazyFileRoute("/play/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div>
      <div>SessionManager</div>
    </div>
  );
}
