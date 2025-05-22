import { createLazyFileRoute } from "@tanstack/react-router";
import { CustomLink } from "mtxuilib/mt/CustomLink";

export const Route = createLazyFileRoute("/sandbox/$sandboxId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sandboxId } = Route.useParams();
  return (
    <div>
      <CustomLink to={"/sandbox/example-sandbox"}>Example sandboxId:{sandboxId}</CustomLink>
    </div>
  );
}
