export type RootAgentState = {
  counter: number;
  text: string;
  color: string;
  mainViewType: "chat" | "scheduler";
  chatHistoryIds: string[];
};
