import { useSuspenseQuery } from "@tanstack/react-query";
import {
  type ProgrammingLanguageOptions,
  type QuickStart,
  uiAgentGetOptions,
} from "mtmaiapi";
import { generateUUID } from "mtxuilib/lib/utils";
import { TighterText } from "mtxuilib/mt/TighterText";
import { Button } from "mtxuilib/ui/button";
import type { FC } from "react";
import { useTenant } from "../../../../hooks/useAuth";
import { useNav } from "../../../../hooks/useNav";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";
import { useHumanInput } from "../chat/hooks/useHumenInput";

interface QuickStartButtonsProps {
  quickStarts: QuickStart[];

  handleQuickStart: (
    type: "text" | "code",
    language?: ProgrammingLanguageOptions,
  ) => void;
}
const QuickStartButtons = (props: QuickStartButtonsProps) => {
  // const handleLanguageSubmit = (language: ProgrammingLanguageOptions) => {
  //   props.handleQuickStart("code", language);
  // };
  // const handleHumanInput = useWorkbenchStore((x) => x.handleHumanInput);
  const { handleInput } = useHumanInput();
  const nav = useNav();

  const handleClick = (text: string) => {
    const newChatId = generateUUID();
    handleInput({ chatId: newChatId, content: text });
    nav({
      to: `/play/chat/${newChatId}`,
    });
  };

  return (
    <div className="flex flex-col gap-8 items-center justify-center w-full">
      <div className="flex flex-col gap-6">
        {/* <p className="text-gray-600 text-sm">Start with a blank canvas</p> */}
        <div className="flex flex-row gap-1 items-center justify-center w-full">
          {/* <Button
            variant="outline"
            className="transition-colors text-gray-600 flex items-center justify-center gap-2 w-[250px] h-[64px]"
            onClick={() => props.handleQuickStart("text")}
          >
            <TighterText>New Markdown</TighterText>
            <NotebookPen />
          </Button>
          <ProgrammingLanguagesDropdown handleSubmit={handleLanguageSubmit} /> */}
        </div>
      </div>
      <div className="flex flex-col gap-6 mt-2 w-full">
        <div className="flex flex-col w-full gap-2 text-gray-700">
          {props.quickStarts.map((quickStart, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <div key={i}>
              <Button
                variant="outline"
                className="flex-1"
                onClick={(e) => {
                  handleClick(quickStart.content);
                }}
              >
                <TighterText>
                  {quickStart.title || quickStart.content}
                </TighterText>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface ThreadWelcomeProps {
  handleQuickStart: (
    type: "text" | "code",
    language?: ProgrammingLanguageOptions,
  ) => void;
  // composer: React.ReactNode;
}

export const ThreadWelcome: FC<ThreadWelcomeProps> = (
  props: ThreadWelcomeProps,
) => {
  const setTeamId = useWorkbenchStore((x) => x.setTeamId);
  const tenant = useTenant();
  const uiAgentStateQuery = useSuspenseQuery({
    ...uiAgentGetOptions({
      path: {
        tenant: tenant!.metadata.id,
      },
    }),
  });
  return (
    <>
      <div className="flex items-center justify-center mt-16 w-full">
        <div className="text-center max-w-3xl w-full">
          {/* <DebugValue data={uiAgentStateQuery.data} /> */}
          {/* <Avatar className="mx-auto">
            <AvatarFallback>AI 小助理</AvatarFallback>
          </Avatar> */}

          <TighterText className="mt-4 text-lg font-medium">
            {uiAgentStateQuery.data?.welcome?.title || "此时此刻想做点什么?"}
          </TighterText>
          <div className="mt-8 w-full">
            <QuickStartButtons
              quickStarts={uiAgentStateQuery.data?.welcome?.quick_starts || []}
              handleQuickStart={props.handleQuickStart}
            />
          </div>
        </div>
      </div>
    </>
  );
};
