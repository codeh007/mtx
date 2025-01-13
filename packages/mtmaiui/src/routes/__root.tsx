import { Outlet, createRootRoute } from "@tanstack/react-router";
import { CustomLink } from "../components/CreatedLink";
import { NotFound } from "../components/notFound";
import { UserFAB } from "../components/UserFAB";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <>
      <UserFAB />
      <div className="p-2 flex gap-2 text-lg border-b">
        <CustomLink
          to="/"
          activeProps={{
            className: "font-bold",
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </CustomLink>{" "}
        <CustomLink
          to="/posts"
          activeProps={{
            className: "font-bold",
          }}
        >
          Posts
        </CustomLink>
        <CustomLink
          to="/dash"
          activeProps={{
            className: "font-bold",
          }}
        >
          Dash
        </CustomLink>{" "}
        <CustomLink
          to="/this-route-does-not-exist"
          activeProps={{
            className: "font-bold",
          }}
        >
          Route Does Not Exist
        </CustomLink>
      </div>
      <hr />
      <Outlet />
    </>
  );
}
