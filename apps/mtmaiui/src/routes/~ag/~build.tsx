import Layout from "../components/layout";
import TeamManager from "../components/views/team/manager";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ag/build")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Layout title="Home" link={"/"}>
      <main style={{ height: "100%" }} className=" h-full ">
        <TeamManager />
      </main>
    </Layout>
  );
}
