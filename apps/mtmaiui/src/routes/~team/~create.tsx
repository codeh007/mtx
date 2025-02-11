import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/team/create")({
  component: RouteComponent,
});

function RouteComponent() {
  // const handleCreateTeam = (newTeam: Team) => {
  //   console.log('newTeam', newTeam)
  //   setCurrentTeam(newTeam)
  //   // also save it to db

  //   handleSaveTeam(newTeam)
  // }
  return <div>todo create team</div>;
}
