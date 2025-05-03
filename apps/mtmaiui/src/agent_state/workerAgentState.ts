export type WorkerAgentState = {
  totalWorkers: number;
};

export type WorkerAgentOutgoingMessage = {
  type: "new_worker_connected";
  data: {
    workerId: string;
  };
};
