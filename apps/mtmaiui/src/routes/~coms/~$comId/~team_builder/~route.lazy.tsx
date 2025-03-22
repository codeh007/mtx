import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { MtTabs, MtTabsList, MtTabsTrigger } from "mtxuilib/mt/tabs";

export const Route = createLazyFileRoute("/coms/$comId/team_builder")({
  component: RouteComponent,
});

function RouteComponent() {
  // const team = useTeamBuilderStoreV2((x) => x.team);

  // const form = useZodForm({
  //   schema: z.object({
  //     label: z.string().optional(),
  //     provider: z.string().optional(),
  //   }),
  //   defaultValues: {
  //     ...team,
  //   },
  // });
  // const handleSubmit = (values) => {
  //   // console.log("(handleSubmit)", values);
  //   form.handleSubmit(values);
  // };

  return (
    <div className="px-4 space-y-4">
      {/* <DebugValue data={{ team }} /> */}
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
    </div>
  );
}
