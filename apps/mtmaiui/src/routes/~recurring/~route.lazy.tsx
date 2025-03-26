import { createLazyFileRoute, Outlet } from "@tanstack/react-router";
import { RootAppWrapper } from "../components/RootAppWrapper";

export const Route = createLazyFileRoute("/recurring ")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <RootAppWrapper>
        <Outlet />
      </RootAppWrapper>
    </>
  );
}
