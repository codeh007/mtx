import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { TeamBuilderProvider } from "../../../stores/teamBuildStore";
import { WorkbrenchProvider } from "../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/coms/$comId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { comId } = Route.useParams();

  // const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>([]);
  // const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>([]);
  // const [testDrawerVisible, setTestDrawerVisible] = useState(false);

  // const [activeDragItem, setActiveDragItem] = useState<DragItemData | null>(
  //   null,
  // );
  // const {
  //   undo,
  //   redo,
  //   loadFromJson,
  //   syncToJson,
  //   addNode,
  //   layoutNodes,
  //   resetHistory,
  //   history,
  //   updateNode,
  // } = useTeamBuilderStore();
  // const sensors = useSensors(
  //   useSensor(PointerSensor, {
  //     activationConstraint: {
  //       distance: 8,
  //     },
  //   }),
  // );
  // const breadcrumbs = matches
  //   .filter((match) => match.context.getTitle)
  //   .map(({ pathname, context }) => {
  //     return {
  //       title: context.getTitle(),
  //       path: pathname,
  //     };
  //   });

  // const teamValidated = validationResults && validationResults.is_valid;

  // const onDragStart = (item: DragItem) => {
  //   // We can add any drag start logic here if needed
  // };
  // const handleDragStart = (event: DragStartEvent) => {
  //   console.log("handleDragStart", event);
  //   const { active } = event;
  //   if (active.data.current) {
  //     setActiveDragItem(active.data.current as DragItemData);
  //   }
  // };
  // const validateDropTarget = (
  //   draggedType: ComponentTypes,
  //   targetType: ComponentTypes,
  // ): boolean => {
  //   const validTargets: Record<ComponentTypes, ComponentTypes[]> = {
  //     model: ["team", "agent"],
  //     tool: ["agent"],
  //     agent: ["team"],
  //     team: [],
  //     termination: ["team"],
  //   };
  //   return validTargets[draggedType]?.includes(targetType) || false;
  // };

  // const handleDragEnd = (event: DragEndEvent) => {
  //   const { active, over } = event;
  //   if (!over || !active.data?.current?.current) return;

  //   const draggedItem = active.data.current.current;
  //   const dropZoneId = over.id as string;

  //   const [nodeId] = dropZoneId.split("@@@");
  //   // Find target node
  //   const targetNode = nodes.find((node) => node.id === nodeId);
  //   if (!targetNode) return;

  //   // Validate drop
  //   const isValid = validateDropTarget(
  //     draggedItem.type,
  //     targetNode.data.component.component_type,
  //   );
  //   if (!isValid) return;

  //   const position = {
  //     x: event.delta.x,
  //     y: event.delta.y,
  //   };

  //   // Pass both new node data AND target node id
  //   addNode(position, draggedItem.config, nodeId);
  //   setActiveDragItem(null);
  // };

  // const handleTestDrawerClose = () => {
  //   // console.log("TestDrawer closed");
  //   setTestDrawerVisible(false);
  // };
  // const handleDragOver = (event: DragOverEvent) => {
  //   const { active, over } = event;
  //   if (!over?.id || !active.data.current) return;

  //   const draggedType = active.data.current.type;
  //   const targetNode = nodes.find((node) => node.id === over.id);
  //   if (!targetNode) return;

  //   const isValid = validateDropTarget(
  //     draggedType,
  //     targetNode.data.component.component_type,
  //   );
  //   // Add visual feedback class to target node
  //   if (isValid) {
  //     targetNode.className = "drop-target-valid";
  //   } else {
  //     targetNode.className = "drop-target-invalid";
  //   }
  // };
  return (
    <WorkbrenchProvider>
      <TeamBuilderProvider componentId={comId}>
        <Outlet />
      </TeamBuilderProvider>
    </WorkbrenchProvider>
  );
}
