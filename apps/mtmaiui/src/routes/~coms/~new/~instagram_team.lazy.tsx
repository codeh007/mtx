import { createLazyFileRoute } from "@tanstack/react-router";
import { useFormContext } from "react-hook-form";
import { FormInstagramTeam } from "../components/form_instagram_team";

export const Route = createLazyFileRoute("/coms/new/instagram_team")({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useFormContext();

  // const componentSchema = z.object({
  //   name: z.string(),
  //   description: z.string(),
  // });
  return (
    <div>
      <h1>新建 instagram 团队</h1>

      <FormInstagramTeam />
    </div>
  );
}
