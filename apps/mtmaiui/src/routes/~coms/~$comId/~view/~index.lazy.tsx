import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/coms/$comId/view/")({
  component: RouteComponent,
});

function RouteComponent() {
  // const { comId } = Route.useParams();
  // const tid = useTenantId();
  // const teamQuery = useSuspenseQuery({
  //   ...comsGetOptions({
  //     path: {
  //       tenant: tid,
  //     },
  //     query: {
  //       com: comId,
  //     },
  //   }),
  // });

  // const nav = useNav();
  // const selectedNodeId = useTeamBuilderStore((x) => x.selectedNodeId);
  // useEffect(() => {
  //   if (selectedNodeId) {
  //     // setSelectedNode(selectedNodeId);
  //     nav({ to: `${selectedNodeId}` });
  //   }
  // }, [selectedNodeId, nav]);
  return <></>;
}
