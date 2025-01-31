import { TeamManager } from "../components/views/team/manager";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/ag/team")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main style={{ height: "100%" }} className=" h-full ">
      <TeamManager />
    </main>
  );
}
