"use client";

import { useAgent } from "agents/react";
import { cn } from "mtxuilib/lib/utils";

import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { memo, useState } from "react";
import { AgentNames } from "../../agent_state/shared";
import type { ShortVideoAgentState } from "../../agents/shortvideo/shortvideo_agent_state";
import { useWorkbenchStore } from "../../stores/workbrench.store";
import { RemotionNextDemo1 } from "../remotion/RemotionNextDemo1";

export const WorkbenchWrapper = memo(function WorkbenchWrapper(props: {
  children: React.ReactNode;
}) {
  const { children } = props;

  return (
    <div className={cn("flex h-full")}>
      {/* 左侧(聊天面板) */}
      <div className="w-full">{children}</div>
      {/* 右侧面板(主体内容) */}
      <WorkbenchContent />
    </div>
  );
});

export const WorkbenchContent = () => {
  const assistantState = useWorkbenchStore((x) => x.assistantState);
  const subAgents = assistantState?.subAgents;
  return (
    <div className="w-full">
      {subAgents?.[AgentNames.shortVideoAg] && (
        <ShortVideoAgentView agentId={subAgents[AgentNames.shortVideoAg]} />
      )}
    </div>
  );
};

interface ShortVideoAgentViewProps {
  agentId: string;
}
const ShortVideoAgentView = ({ agentId }: ShortVideoAgentViewProps) => {
  const [shortVideoAgentState, setShortVideoAgentState] = useState<ShortVideoAgentState>({});

  const agentUrl = useWorkbenchStore((state) => state.agentUrl);
  const agentPathPrefix = useWorkbenchStore((state) => state.agentPathPrefix);
  const isDebug = useWorkbenchStore((state) => state.isDebug);

  const shortVideoAgent = useAgent<ShortVideoAgentState>({
    agent: AgentNames.shortVideoAg,
    host: new URL(agentUrl).host,
    prefix: agentPathPrefix,
    name: agentId,
    onStateUpdate: (newState) => setShortVideoAgentState(newState),
  });
  return (
    <div className="w-full h-full">
      {isDebug && <DebugValue data={shortVideoAgentState} />}
      <RemotionNextDemo1 title={shortVideoAgentState.video_subject} />
    </div>
  );
};
