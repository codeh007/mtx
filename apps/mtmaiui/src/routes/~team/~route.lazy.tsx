import { useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTenant, useUser } from "../../hooks/useAuth";
// import { teamAPI } from "../components/views/team/api.ts--";

import { type MtComponent, comsListOptions } from "mtmaiapi";
import { RootAppWrapper } from "../../components/RootAppWrapper";
import type { Team } from "../../types/datamodel";
import { TeamSidebar } from "./sidebar";

export const Route = createLazyFileRoute("/team")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<MtComponent | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("teamSidebar");
      return stored !== null ? JSON.parse(stored) : true;
    }
  });

  // const [messageApi, contextHolder] = message.useMessage();
  // const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const user = useUser();
  const tenant = useTenant();

  // Persist sidebar state
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("teamSidebar", JSON.stringify(isSidebarOpen));
    }
  }, [isSidebarOpen]);

  const teamQuery = useSuspenseQuery({
    ...comsListOptions({
      path: {
        tenant: tenant!.metadata?.id,
      },
    }),
  });

  // Handle URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const teamId = params.get("teamId");

    if (teamId && !currentTeam) {
      // handleSelectTeam({ id: Number.parseInt(teamId) } as Team);
    }
  }, []);

  useEffect(() => {
    const handleLocationChange = () => {
      const params = new URLSearchParams(window.location.search);
      const teamId = params.get("teamId");

      if (!teamId && currentTeam) {
        setCurrentTeam(null);
      }
    };

    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, [currentTeam]);

  // const handleSelectTeam = async (selectedTeam: Team) => {
  //   if (!user?.email || !selectedTeam.id) return;

  //   if (hasUnsavedChanges) {
  //     Modal.confirm({
  //       title: "Unsaved Changes",
  //       content: "You have unsaved changes. Do you want to discard them?",
  //       okText: "Discard",
  //       cancelText: "Go Back",
  //       onOk: () => {
  //         switchToTeam(selectedTeam.id);
  //       },
  //       // onCancel - do nothing, user stays on current team
  //     });
  //   } else {
  //     await switchToTeam(selectedTeam.id);
  //   }
  // };

  // Modify switchToTeam to take the id directly
  // const switchToTeam = async (teamId: number | undefined) => {
  //   console.log("switchToTeam", teamId);
  //   if (!teamId || !user?.email) return;
  //   setIsLoading(true);
  //   try {
  //     const data = await teamAPI.getTeam(teamId, user.email!);
  //     setCurrentTeam(data);
  //     window.history.pushState({}, "", `?teamId=${teamId}`);
  //   } catch (error) {
  //     console.error("Error loading team:", error);
  //     messageApi.error("Failed to load team");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleDeleteTeam = async (teamId: number) => {
    if (!user?.email) return;

    try {
      // await teamAPI.deleteTeam(teamId, user.email);
      // setTeams(teams.filter((t) => t.id !== teamId));
      // if (currentTeam?.id === teamId) {
      //   setCurrentTeam(null);
      // }
      // messageApi.success("Team deleted");
    } catch (error) {
      console.error("Error deleting team:", error);
      // messageApi.error("Error deleting team");
    }
  };

  const handleCreateTeam = (newTeam: MtComponent) => {
    console.log("newTeam", newTeam);
    setCurrentTeam(newTeam);
    // also save it to db

    handleSaveTeam(newTeam);
  };

  // const createTeamMutation = useMutation({
  //   ...teamCreateMutation({}),
  // });

  const handleSaveTeam = async (teamData: Partial<Team>) => {
    // if (!user?.email) return;
    console.log("teamData", teamData);
    const sanitizedTeamData = {
      ...teamData,
      created_at: undefined, // Remove these fields
      updated_at: undefined, // Let server handle timestamps
    };

    console.log("teamData", sanitizedTeamData);
    // const savedTeam = await createTeamMutation.mutateAsync({
    //   path: {
    //     tenant: tenant!.metadata.id,
    //   },
    //   body: {
    //     ...sanitizedTeamData,
    //   },
    // });

    // messageApi.success(
    //   `Team ${teamData.metadata.id ? "updated" : "created"} successfully`,
    // );

    // Update teams list
    // if (teamData.id) {
    //   setTeams(teams.map((t) => (t.id === savedTeam.id ? savedTeam : t)));
    //   if (currentTeam?.id === savedTeam.id) {
    //     setCurrentTeam(savedTeam);
    //   }
    // } else {
    //   setTeams([savedTeam, ...teams]);
    //   setCurrentTeam(savedTeam);
    // }
  };

  if (!tenant) {
    return null;
  }

  return (
    <RootAppWrapper secondSidebar={<TeamSidebar />}>
      <Outlet />
    </RootAppWrapper>
  );
}
