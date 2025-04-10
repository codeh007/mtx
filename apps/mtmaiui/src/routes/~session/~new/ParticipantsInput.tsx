import type { AssistantAgentComponent } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useFormContext } from "react-hook-form";

interface ParticipantsInputProps {
  participants: AssistantAgentComponent[];
  onChange: (participants: AssistantAgentComponent[]) => void;
}
export const ParticipantsInput = ({
  participants,
  onChange,
}: ParticipantsInputProps) => {
  const form = useFormContext();
  return (
    <>
      <h1>ParticipantsFields</h1>
      <DebugValue data={participants} />
    </>
  );
};
