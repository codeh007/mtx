import { createLazyFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { buttonVariants } from "mtxuilib/ui/button";

export const Route = createLazyFileRoute("/coms/$comId/team_builder/agent/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { comId } = Route.useParams();
  return (
    <>
      <div className="flex items-center gap-2 justify-end mr-2 pt-2">
        <CustomLink
          to={`/coms/${comId}/team_builder/agent/new`}
          className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
        >
          <PlusIcon className="size-4" />
        </CustomLink>
      </div>
    </>
  );
}
