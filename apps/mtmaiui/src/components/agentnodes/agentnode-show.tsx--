"use client";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { agentNodeOptions, agentRunMutation } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { Button } from "mtxuilib/ui/button";
import { useTenant } from "../../hooks/useAuth";
import { AgentNodeEditView } from "./agentnode-edit";

interface AgentNodeShowViewProps {
  id: string;
}
export const AgentNodeShowView = ({ id }: AgentNodeShowViewProps) => {
  const tenant = useTenant();
  const agentNodeGetQuery = useSuspenseQuery({
    ...agentNodeOptions({
      path: {
        tenant: tenant!.metadata.id,
        node: id,
      },
    }),
  });
  const runStepMutation = useMutation({
    ...agentRunMutation(),
    onSuccess: (data) => {
      console.log(data);
    },
  });
  const handleStepClick = async () => {
    const result = await runStepMutation.mutateAsync({
      path: {
        tenant: tenant!.metadata.id,
      },
      body: {
        params: {
          text: "xxxxxxxxxxxxx",
        },
        flowName: "research",
        isStream: false,
      },
    });
  };
  const nodeData = agentNodeGetQuery.data;
  return (
    <>
      <div className="flex w-full p-2">
        <h2>{nodeData?.title}</h2>
        <DebugValue data={{ data: nodeData }} />
      </div>
      <div>
        <Button onClick={handleStepClick}>运行</Button>
      </div>

      <div>
        <AgentNodeEditView id={id} />
      </div>
    </>
  );
};
