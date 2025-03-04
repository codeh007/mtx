import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { Team } from "../../types/datamodel";
import { NavPlayground } from "./sidebar";

export const Route = createLazyFileRoute("/play/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div>
      <NavPlayground />
      <div>SessionManager</div>
    </div>
  );
}
