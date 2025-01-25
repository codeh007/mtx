import { Outlet, createFileRoute } from "@tanstack/react-router";
import { RootAppWrapper } from "../components/RootAppWrapper";

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RootAppWrapper>
      <Outlet />
    </RootAppWrapper>
  );
}
