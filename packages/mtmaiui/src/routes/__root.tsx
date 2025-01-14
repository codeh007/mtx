import { Outlet, createRootRoute } from "@tanstack/react-router";
import { HatchatLoader } from "../components/HatchatLoader";
import { UserFAB } from "../components/UserFAB";
import { NotFound } from "../components/notFound";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <div className="fixed flex top-0 left-0 w-full h-full">
      <UserFAB />
      <Outlet />
      <HatchatLoader />
    </div>
  );
}
