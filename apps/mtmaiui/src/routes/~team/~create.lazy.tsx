import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { tenantSeedMutation } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import { useTenant } from "../../hooks/useAuth";

export const Route = createLazyFileRoute("/team/create")({
  component: RouteComponent,
});

function RouteComponent() {
  // const handleCreateTeam = (newTeam: Team) => {
  //   console.log('newTeam', newTeam)
  //   setCurrentTeam(newTeam)
  //   // also save it to db

  //   handleSaveTeam(newTeam)
  // }
  const tenant = useTenant();

  const seedTenant = useMutation({
    ...tenantSeedMutation({
      // path: {
      //   tenant: tenant,
      // },
    }),
  });
  return (
    <div>
      <h1>Create Team</h1>
      <input type="text" placeholder="Team Name" />
      <Button
        onClick={() => {
          seedTenant.mutate({
            // : "test",
          });
        }}
      >
        Create
      </Button>
    </div>
  );
}
