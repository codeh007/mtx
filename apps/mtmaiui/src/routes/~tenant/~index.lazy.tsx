import { createLazyFileRoute } from "@tanstack/react-router";
import { CustomLink } from "mtxuilib/mt/CustomLink";

export const Route = createLazyFileRoute("/tenant/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <CustomLink to="/tenant/settings">setting</CustomLink>
    </>
  );
}
