import { createFileRoute } from "@tanstack/react-router";
import { SessionManager } from "../components/views/session/manager";

export const Route = createFileRoute("/ag/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main style={{ height: "100%" }} className=" h-full ">
      <SessionManager />
    </main>
  );
}
