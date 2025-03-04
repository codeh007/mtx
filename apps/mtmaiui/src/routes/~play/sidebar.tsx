"use client";
import type { ChatSession } from "mtmaiapi";

interface SidebarProps {
  isOpen: boolean;
  currentSession: ChatSession | null;
  onToggle: () => void;
  onSelectSession: (session: ChatSession) => void;
  onEditSession: (session?: ChatSession) => void;
  onDeleteSession: (sessionId: number) => void;
  isLoading?: boolean;
}

export const PlaygroundSidebar = (props: SidebarProps) => {
  return (
    <div className="h-full border-r border-secondary ">
      play ground siderbar
    </div>
  );
};
