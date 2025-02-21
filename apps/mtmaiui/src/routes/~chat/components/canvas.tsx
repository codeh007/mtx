"use client";

import type { ProgrammingLanguageOptions } from "mtmaiapi";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { cn } from "mtxuilib/lib/utils";
import { useToast } from "mtxuilib/ui/use-toast";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useWorkbenchStore } from "../../../stores/workbrench.store";
import { Route } from "../../~__root";
import { WorkflowRunView } from "../../~workflow-runs/components/WorkflowRunView";
import { ContentComposerChatInterface } from "./content-composer";

const LZArtifactRenderer = dynamic(
  () =>
    import("./artifacts/ArtifactRenderer").then((mod) => mod.ArtifactRenderer),
  {
    ssr: false,
  },
);

export function CanvasComponent() {
  const { toast } = useToast();
  const chatStarted = useWorkbenchStore((x) => x.chatStarted);
  const setChatStarted = useWorkbenchStore((x) => x.setChatStarted);
  const openWorkBench = useWorkbenchStore((x) => x.openWorkBench);
  const [isEditing, setIsEditing] = useState(false);
  const runId = useWorkbenchStore((x) => x.runId);

  // useEffect(() => {
  //   if (!threadId || !user) return;
  //   // Clear threads with no values
  //   clearThreadsWithNoValues(user.id);
  // }, [threadId, user]);
  // const tenant = useTenant();

  const handleQuickStart = (
    type: "text" | "code",
    language?: ProgrammingLanguageOptions,
  ) => {
    if (type === "code" && !language) {
      toast({
        title: "Language not selected",
        description: "Please select a language to continue",
        duration: 5000,
      });
      return;
    }
    setChatStarted(true);

    // let artifactContent: ArtifactCodeV3 | ArtifactMarkdownV3;
    // if (type === "code" && language) {
    //   artifactContent = {
    //     index: 1,
    //     type: "code",
    //     title: `Quick start ${type}`,
    //     code: getLanguageTemplate(language),
    //     language,
    //   };
    // } else {
    //   artifactContent = {
    //     index: 1,
    //     type: "text",
    //     title: `Quick start ${type}`,
    //     fullMarkdown: "",
    //   };
    // }

    // const newArtifact: ArtifactV3 = {
    //   currentIndex: 1,
    //   contents: [artifactContent],
    // };
    // Do not worry about existing items in state. This should
    // never occur since this action can only be invoked if
    // there are no messages/artifacts in the thread.
    // setArtifact(newArtifact);
    setIsEditing(true);
  };
  const threadId = useWorkbenchStore((x) => x.threadId);
  const nav = Route.useNavigate();
  useEffect(() => {
    if (!threadId) return;
    console.log("CanvasComponent", {
      threadId: threadId,
    });
    nav({ to: `/chat/${threadId}` });
  }, [threadId, nav]);

  return (
    <main className="flex flex-row h-full">
      <div
        className={cn(
          "transition-all duration-700",
          openWorkBench ? "w-[35%]" : "w-full",
          "h-full mr-auto bg-gray-50/70 shadow-inner-right",
        )}
      >
        <ContentComposerChatInterface
          switchSelectedThreadCallback={(thread) => {
            // Chat should only be "started" if there are messages present
            if ((thread.values as Record<string, any>)?.messages?.length) {
              setChatStarted(true);
              // setModelName(
              //   thread?.metadata?.customModelName as ALL_MODEL_NAMES,
              // );
            } else {
              setChatStarted(false);
            }
          }}
          setChatStarted={setChatStarted}
          hasChatStarted={chatStarted ?? false}
          handleQuickStart={handleQuickStart}
        />
      </div>

      {openWorkBench && (
        <MtSuspenseBoundary>
          <div className="w-full ml-auto">
            <LZArtifactRenderer
              setIsEditing={setIsEditing}
              isEditing={isEditing}
            />
          </div>
        </MtSuspenseBoundary>
      )}
      {runId && (
        <MtSuspenseBoundary>
          <div className="w-full ml-auto">
            <WorkflowRunView runId={runId} />
          </div>
        </MtSuspenseBoundary>
      )}
    </main>
  );
}

export const Canvas = React.memo(CanvasComponent);
