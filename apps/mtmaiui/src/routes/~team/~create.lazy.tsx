import { createLazyFileRoute } from '@tanstack/react-router'
import { Button } from 'mtxuilib/ui/button'

export const Route = createLazyFileRoute('/team/create')({
  component: RouteComponent,
})

function RouteComponent() {
  // const handleCreateTeam = (newTeam: Team) => {
  //   console.log('newTeam', newTeam)
  //   setCurrentTeam(newTeam)
  //   // also save it to db

  //   handleSaveTeam(newTeam)
  // }
  return (
    <div>
      <h1>Create Team</h1>
      <input type="text" placeholder="Team Name" />
      <Button onClick={() => {}}>Create</Button>
    </div>
  )
}
