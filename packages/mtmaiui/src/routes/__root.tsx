import { Outlet, createRootRoute } from "@tanstack/react-router";
import { UserFAB } from "../components/UserFAB";
import { NotFound } from "../components/notFound";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-red-100">
      <UserFAB />
      <Outlet />
    </div>
  );
}
