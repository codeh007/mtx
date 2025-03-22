import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { EditFormToolbar } from "mtxuilib/mt/form/EditFormToolbar";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { MtTabs, MtTabsList, MtTabsTrigger } from "mtxuilib/mt/tabs";
import { z } from "zod";
import { useTeamBuilderStore } from "../../../../stores/teamBuildStore";

export const Route = createLazyFileRoute("/coms/$comId/team_builder")({
  component: RouteComponent,
});

function RouteComponent() {
  const { comId } = Route.useParams();
  const selectedNode = useTeamBuilderStore((x) => x.selectedNode);
  const setSelectedNode = useTeamBuilderStore((x) => x.setSelectedNode);
  const updateNode = useTeamBuilderStore((x) => x.updateNode);
  const handleSave = useTeamBuilderStore((x) => x.handleSave);

  const component = useTeamBuilderStore((x) => x.component);

  const form = useZodForm({
    schema: z.object({
      label: z.string().optional(),
      provider: z.string().optional(),
    }),
    defaultValues: {
      ...component,
    },
  });
  const handleSubmit = (values) => {
    console.log("(handleSubmit)", values);
  };
  return (
    <ZForm form={form} handleSubmit={handleSubmit} className="px-4 space-y-4">
      <MtTabs defaultValue="team" className="w-full">
        <MtTabsList layout="underlined">
          <CustomLink to="team">
            <MtTabsTrigger variant="underlined" value="team">
              团队
            </MtTabsTrigger>
          </CustomLink>
          <CustomLink to="agent">
            <MtTabsTrigger variant="underlined" value="agents">
              agent
            </MtTabsTrigger>
          </CustomLink>
        </MtTabsList>
        <Outlet />
      </MtTabs>
      <EditFormToolbar form={form} />
    </ZForm>
  );
}
