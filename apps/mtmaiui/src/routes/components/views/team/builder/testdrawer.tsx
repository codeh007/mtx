import { useEffect, useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "mtxuilib/ui/sheet";
import type { Session, Team } from "../../../../../types/datamodel";

interface TestDrawerProps {
  isVisble: boolean;
  team: Team;
  onClose: () => void;
}

export const TestDrawer = ({ isVisble, onClose, team }: TestDrawerProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteOnClose, setDeleteOnClose] = useState(true);

  const createSession = async (teamId: number, teamName: string) => {
    // if (!user?.email) return;
    try {
      const defaultName = `Test Session ${teamName.substring(
        0,
        20,
      )} - ${new Date().toLocaleString()} `;
      //   const created = await sessionAPI.createSession(
      //     {
      //       name: defaultName,
      //       team_id: teamId,
      //     },
      //     user.email,
      //   );
      //   setSession(created);
    } catch (error) {
      // messageApi.error("Error creating session");
    }
  };

  const deleteSession = async (sessionId: number) => {
    // if (!user?.email) return;
    // try {
    //   await sessionAPI.deleteSession(sessionId, user.email);
    //   setSession(null); // Clear session state after successful deletion
    // } catch (error) {
    //   messageApi.error("Error deleting session");
    // }
  };

  // Single effect to handle session creation when drawer opens
  useEffect(() => {
    // if (isVisble && team?.id && !session) {
    //   setLoading(true);
    //   createSession(
    //     team.id,
    //     team.component.label || team.component.component_type,
    //   ).finally(() => {
    //     setLoading(false);
    //   });
    // }
  }, [isVisble, team?.id]);

  // Single cleanup handler in the Drawer's onClose
  const handleClose = async () => {
    if (session?.id && deleteOnClose) {
      // Only delete if flag is true
      await deleteSession(session.id);
    }
    onClose();
  };

  return (
    <>
      <Sheet
        // title={<span>Test Team: {team.component.label}</span>}
        // size="large"
        // placement="right"
        onClose={handleClose}
        open={isVisble}
        // extra={
        //   <Checkbox
        //     checked={deleteOnClose}
        //     // onChange={(e) => setDeleteOnClose(e.target.checked)}
        //   >
        //     Delete session on close
        //   </Checkbox>
        // }
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Test Team: {team.component.label}</SheetTitle>
          </SheetHeader>
        </SheetContent>
        {loading && <p>Creating a test session...</p>}
        {/* {session && <ChatView session={session} />} */}
      </Sheet>
    </>
  );
};
