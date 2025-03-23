import { createLazyFileRoute } from '@tanstack/react-router'
import { ComponentEditor } from '../../../../components/component-editor/component-editor'
import {
  ModelContent,
  ModelHeader,
  ModelTitle,
  MtModal,
  useModelStore,
} from '../../../../stores/model.store'
import { useTeamBuilderStore } from '../../../../stores/teamBuildStore'

export const Route = createLazyFileRoute(
  '/coms/$comId/component_editor/InstagramTeam',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const selectedNode = useTeamBuilderStore((x) => x.selectedNode)
  const updateNode = useTeamBuilderStore((x) => x.updateNode)
  const setSelectedNode = useTeamBuilderStore((x) => x.setSelectedNode)
  const setOpen = useModelStore((x) => x.setOpen)
  if (!selectedNode?.data.component) {
    return <div>no component selected</div>
  }
  return (
    <MtModal>
      <ModelContent>
        <ModelHeader>
          <ModelTitle>assistant agent</ModelTitle>
        </ModelHeader>
        <ComponentEditor
          component={selectedNode?.data.component}
          onChange={(updatedComponent) => {
            if (selectedNode?.id) {
              updateNode(selectedNode.id, {
                component: updatedComponent,
              })
            }
          }}
          onClose={() => {
            setSelectedNode(null)
            setOpen(false)
            window.history.back()
          }}
          navigationDepth={true}
        />
      </ModelContent>
    </MtModal>
  )
}
