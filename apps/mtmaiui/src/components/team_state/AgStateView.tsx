"use client";

import type { AgState } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { ModelContextStateView } from "./ModelContextStateView";

interface RuntimeStateViewProps {
  state: AgState;
}
export const AgStateView = ({ state }: RuntimeStateViewProps) => {
  const topic = state.topic;
  if (topic === "user") {
    return <UserTopicView state={state} />;
  }
  return (
    <div className="flex flex-col gap-2 bg-gray-100 p-2 rounded-md">
      <div className="text-sm font-bold">Unknown Topic: {topic}</div>
      <DebugValue data={{ state }} />
    </div>
  );
};

interface UserTopicViewProps {
  state: AgState;
}
export const UserTopicView = ({ state }: UserTopicViewProps) => {
  const topic = state.topic;
  return (
    <>
      <div className="text-sm font-bold">{topic}</div>
      <ModelContextStateView
        modelContextState={state.state.model_context as any}
      />
    </>
  );
};
