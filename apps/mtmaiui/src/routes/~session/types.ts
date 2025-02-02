import { Session } from "mtmaiapi";



export interface SessionListProps {
  sessions: Session[];
  currentSession?: Session | null;
  onSelect: (session: Session) => void;
  onEdit: (session: Session) => void;
  onDelete: (sessionId: number) => void;
  isLoading?: boolean;
}

// export interface SessionFormState {
//   name: string;
//   team_id: string;
//   isSubmitting: boolean;
//   error?: string;
// }
