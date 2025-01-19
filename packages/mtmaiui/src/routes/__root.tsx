import { Outlet, createRootRoute } from "@tanstack/react-router";
import { UserFAB } from "../components/UserFAB";
import { NotFound } from "../components/notFound";
// import { useSessionLoader } from "../hooks/useAuth";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  // useSessionLoader();
  return (
    <div className="fixed flex top-0 left-0 w-full h-full">
      <UserFAB />
      <Outlet />
    </div>
  );
}
