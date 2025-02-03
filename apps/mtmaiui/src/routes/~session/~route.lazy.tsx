import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import type { Session } from "mtmaiapi";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { SidebarInset } from "mtxuilib/ui/sidebar";
import { toast } from "mtxuilib/ui/use-toast";
import { Suspense, useEffect, useState } from "react";
import { DashContent } from "../../components/DashContent";
import { DashHeaders } from "../../components/DashHeaders";
import { DashSidebar } from "../../components/sidebar/siderbar";
import { useGraphStore } from "../../stores/GraphContext";
// import { appContext } from "../../stores/agStoreProvider";
import { RootAppWrapper } from "../components/RootAppWrapper";
import { Sidebar } from "../~chat/sidebar";
import { SessionEditor } from "./session-editor";

export const Route = createLazyFileRoute("/session")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | undefined>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sessionSidebar");
      return stored !== null ? JSON.parse(stored) : true;
    }
    return true; // Default value during SSR
  });

  const session = useGraphStore((x) => x.session);
  const setSession = useGraphStore((x) => x.setSession);
  const sessions = useGraphStore((x) => x.sessions);
  const setSessions = useGraphStore((x) => x.setSessions);

  // Handle initial URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("sessionId");

    if (sessionId && !session) {
      handleSelectSession({ id: Number.parseInt(sessionId) } as Session);
    }
  }, []);

  const handleDeleteSession = async (sessionId: number) => {
    // if (!user?.email) return;

    try {
      // const response = await sessionAPI.deleteSession(sessionId, user.email)
      // setSessions(sessions.filter((s) => s.id !== sessionId))
      // if (session?.id === sessionId || sessions.length === 0) {
      //   setSession(sessions[0] || null)
      //   window.history.pushState({}, '', window.location.pathname) // Clear URL params
      // }
      // messageApi.success('Session deleted')
      toast({
        title: "Success",
        description: "Session deleted",
      }); // 替换 messageApi.success
    } catch (error) {
      console.error("Error deleting session:", error);
      toast({
        title: "Error",
        description: "Error deleting session",
      }); // 替换 messageApi.error
    }
  };

  const handleSelectSession = async (selectedSession: Session) => {
    // if (!user?.email || !selectedSession.metadata.id) return;

    try {
      setIsLoading(true);
      // const data = await sessionAPI.getSession(
      //   selectedSession.metadata.id,
      //   user.email,
      // );
      // if (!data) {
      //   // Session not found
      //   toast({
      //     title: "Error",
      //     description: "Session not found",
      //   });
      //   window.history.pushState({}, "", window.location.pathname); // Clear URL
      //   if (sessions.length > 0) {
      //     setSession(sessions[0]); // Fall back to first session
      //   } else {
      //     setSession(null);
      //   }
      //   return;
      // }
      // setSession(data);
      window.history.pushState(
        {},
        "",
        `?sessionId=${selectedSession.metadata.id}`,
      );
    } catch (error) {
      console.error("Error loading session:", error);
      toast({
        title: "Error",
        description: "Error loading session",
      });
      window.history.pushState({}, "", window.location.pathname); // Clear invalid URL
      if (sessions.length > 0) {
        setSession(sessions[0]); // Fall back to first session
      } else {
        setSession(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RootAppWrapper>
      <DashSidebar />
      <SidebarInset>
        <DashHeaders>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>posts</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DashHeaders>
        <DashContent>
          <Suspense fallback={<div>Loading...</div>}>
            <div className="relative flex h-full w-full">
              {/* {contextHolder} */}
              <div
                className={`absolute left-0 top-0 h-full transition-all duration-200 ease-in-out ${
                  isSidebarOpen ? "w-64" : "w-12"
                }`}
              >
                <Sidebar
                  isOpen={isSidebarOpen}
                  currentSession={session}
                  onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                  onSelectSession={handleSelectSession}
                  onEditSession={(session) => {
                    setEditingSession(session);
                    setIsEditorOpen(true);
                  }}
                  onDeleteSession={handleDeleteSession}
                  isLoading={isLoading}
                />
              </div>

              <div
                className={`flex-1 transition-all -mr-4 duration-200 ${
                  isSidebarOpen ? "ml-64" : "ml-12"
                }`}
              >
                <Outlet />
              </div>

              <SessionEditor
                session={editingSession}
                isOpen={isEditorOpen}
                // onSave={handleSaveSession}
                onCancel={() => {
                  setIsEditorOpen(false);
                  setEditingSession(undefined);
                }}
              />
            </div>
          </Suspense>
        </DashContent>
      </SidebarInset>
    </RootAppWrapper>
  );
}
