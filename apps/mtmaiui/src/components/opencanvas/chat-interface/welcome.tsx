import { ThreadPrimitive, useThreadRuntime } from "@assistant-ui/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { NotebookPen } from "lucide-react";
import {
  type ProgrammingLanguageOptions,
  type QuickStart,
  uiAgentGetOptions,
} from "mtmaiapi";
import { MtErrorBoundary } from "mtxuilib/components/MtErrorBoundary";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { TighterText } from "mtxuilib/mt/TighterText";
import { Avatar, AvatarFallback } from "mtxuilib/ui/avatar";
import { Button } from "mtxuilib/ui/button";
import type { FC } from "react";
import { useTenant } from "../../../hooks/useAuth";
import { TeamCombo } from "../../../routes/~team/TeamCombo";
import { useGraphStore } from "../../../stores/GraphContext";
import { ProgrammingLanguagesDropdown } from "../programming-lang-dropdown";

// const QuickStartPrompts = () => {
//   return (
//     <div className="flex flex-col w-full gap-2 text-gray-700">
//       <div className="flex gap-2 w-full">
//         <Button
//           onClick={(e) =>
//             handleClick((e.target as HTMLButtonElement).textContent || "")
//           }
//           variant="outline"
//           className="flex-1"
//         >
//           <TighterText>Write me a TODO app in React</TighterText>
//         </Button>
//         <Button
//           onClick={(e) =>
//             handleClick((e.target as HTMLButtonElement).textContent || "")
//           }
//           variant="outline"
//           className="flex-1"
//         >
//           <TighterText>
//             Explain why the sky is blue in a short essay
//           </TighterText>
//         </Button>
//       </div>
//       <div className="flex gap-2 w-full">
//         <Button
//           onClick={(e) =>
//             handleClick((e.target as HTMLButtonElement).textContent || "")
//           }
//           variant="outline"
//           className="flex-1"
//         >
//           <TighterText>
//             Help me draft an email to my professor Craig
//           </TighterText>
//         </Button>
//         <Button
//           onClick={(e) =>
//             handleClick((e.target as HTMLButtonElement).textContent || "")
//           }
//           variant="outline"
//           className="flex-1"
//         >
//           <TighterText>Write a web scraping program in Python</TighterText>
//         </Button>
//       </div>
//     </div>
//   );
// };

interface QuickStartButtonsProps {
  quickStarts: QuickStart[];

  handleQuickStart: (
    type: "text" | "code",
    language?: ProgrammingLanguageOptions,
  ) => void;
  composer: React.ReactNode;
}
const QuickStartButtons = (props: QuickStartButtonsProps) => {
  const handleLanguageSubmit = (language: ProgrammingLanguageOptions) => {
    props.handleQuickStart("code", language);
  };
  const threadRuntime = useThreadRuntime();

  const handleClick = (text: string) => {
    threadRuntime.append({
      role: "user",
      content: [{ type: "text", text }],
    });
  };

  return (
    <div className="flex flex-col gap-8 items-center justify-center w-full">
      <div className="flex flex-col gap-6">
        <p className="text-gray-600 text-sm">Start with a blank canvas</p>
        <div className="flex flex-row gap-1 items-center justify-center w-full">
          <Button
            variant="outline"
            className="transition-colors text-gray-600 flex items-center justify-center gap-2 w-[250px] h-[64px]"
            onClick={() => props.handleQuickStart("text")}
          >
            <TighterText>New Markdown</TighterText>
            <NotebookPen />
          </Button>
          <ProgrammingLanguagesDropdown handleSubmit={handleLanguageSubmit} />
        </div>
      </div>
      <div className="flex flex-col gap-6 mt-2 w-full">
        <p className="text-gray-600 text-sm">or with a message</p>
        {/* <QuickStartPrompts /> */}
        <div className="flex flex-col w-full gap-2 text-gray-700">
          {props.quickStarts.map((quickStart, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <div key={i}>
              <Button
                onClick={
                  (e) => {
                    handleClick(
                      (e.target as HTMLButtonElement).textContent || "",
                    );
                  }
                  //
                }
                variant="outline"
                className="flex-1"
              >
                <TighterText>
                  Write a web scraping program in Python
                </TighterText>
              </Button>
            </div>
          ))}
        </div>
        {props.composer}
      </div>
    </div>
  );
};

interface ThreadWelcomeProps {
  handleQuickStart: (
    type: "text" | "code",
    language?: ProgrammingLanguageOptions,
  ) => void;
  composer: React.ReactNode;
}

export const ThreadWelcome: FC<ThreadWelcomeProps> = (
  props: ThreadWelcomeProps,
) => {
  const setTeamId = useGraphStore((x) => x.setTeamId);
  const tenant = useTenant();
  const uiAgentStateQuery = useSuspenseQuery({
    ...uiAgentGetOptions({
      path: {
        tenant: tenant!.metadata.id,
      },
    }),
  });
  return (
    <ThreadPrimitive.Empty>
      <div className="flex items-center justify-center mt-16 w-full">
        <div className="text-center max-w-3xl w-full">
          <DebugValue data={uiAgentStateQuery.data} />
          <Avatar className="mx-auto">
            {/* <AvatarImage src="/lc_logo.jpg" alt="LangChain Logo" /> */}
            <AvatarFallback>AI 小助理</AvatarFallback>
          </Avatar>

          <MtErrorBoundary>
            <TeamCombo
              onChange={(value) => {
                setTeamId(value as string);
              }}
            />
          </MtErrorBoundary>
          <TighterText className="mt-4 text-lg font-medium">
            {uiAgentStateQuery.data?.welcome?.title || "此时此刻想做点什么?"}
          </TighterText>
          <div className="mt-8 w-full">
            <QuickStartButtons
              quickStarts={uiAgentStateQuery.data?.welcome?.quick_starts || []}
              composer={props.composer}
              handleQuickStart={props.handleQuickStart}
            />
          </div>
        </div>
      </div>
    </ThreadPrimitive.Empty>
  );
};
