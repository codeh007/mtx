import { CopyIcon, PenIcon, RedoIcon, UndoIcon } from "lucide-react";
import { MessageIcon } from "mtxuilib/icons/aichatbot.icons";
import { Button } from "mtxuilib/ui/button";
import { toast } from "sonner";
import type { Suggestion } from "../../../db/schema";
import { Artifact } from "../../create-artifact";
import { DiffView } from "../../diffview";
import { DocumentSkeleton } from "../../document-skeleton";
import { ClockRewind } from "../../icons";
import { Editor } from "../../text-editor";
// import { getSuggestions } from "../actions";

interface ShortVideoArtifactMetadata {
  suggestions: Array<Suggestion>;
}

export const shortVideoArtifact = new Artifact<"shortvideo", ShortVideoArtifactMetadata>({
  kind: "shortvideo",
  description: "Useful for short video content, like drafting videos and reels.",
  initialize: async ({ documentId, setMetadata }) => {
    // const suggestions = await getSuggestions({ documentId });

    setMetadata({
      // suggestions,
    });
  },
  onStreamPart: ({ streamPart, setMetadata, setArtifact }) => {
    if (streamPart.type === "suggestion") {
      setMetadata((metadata) => {
        return {
          suggestions: [...metadata.suggestions, streamPart.content as Suggestion],
        };
      });
    }

    if (streamPart.type === "text-delta") {
      setArtifact((draftArtifact) => {
        return {
          ...draftArtifact,
          content: draftArtifact.content + (streamPart.content as string),
          isVisible:
            draftArtifact.status === "streaming" &&
            draftArtifact.content.length > 400 &&
            draftArtifact.content.length < 450
              ? true
              : draftArtifact.isVisible,
          status: "streaming",
        };
      });
    }
  },
  content: ({
    mode,
    status,
    content,
    isCurrentVersion,
    currentVersionIndex,
    onSaveContent,
    getDocumentContentById,
    isLoading,
    metadata,
  }) => {
    if (isLoading) {
      return <DocumentSkeleton artifactKind="text" />;
    }

    if (mode === "diff") {
      const oldContent = getDocumentContentById(currentVersionIndex - 1);
      const newContent = getDocumentContentById(currentVersionIndex);

      return <DiffView oldContent={oldContent} newContent={newContent} />;
    }

    return (
      <>
        <div className="flex flex-row gap-2 w-full bg-slate-100 rounded-lg p-2">
          <Button
            onClick={() => {
              console.log(content);
            }}
          >
            测试1
          </Button>
        </div>
        <div className="flex flex-row py-8 md:p-20 px-4 ">
          <Editor
            content={content}
            suggestions={metadata ? metadata.suggestions : []}
            isCurrentVersion={isCurrentVersion}
            currentVersionIndex={currentVersionIndex}
            status={status}
            onSaveContent={onSaveContent}
          />
          {metadata?.suggestions && metadata.suggestions.length > 0 ? (
            <div className="md:hidden h-dvh w-12 shrink-0" />
          ) : null}
        </div>
      </>
    );
  },
  actions: [
    {
      icon: <ClockRewind size={18} />,
      description: "View changes",
      onClick: ({ handleVersionChange }) => {
        handleVersionChange("toggle");
      },
      isDisabled: ({ currentVersionIndex, setMetadata }) => {
        if (currentVersionIndex === 0) {
          return true;
        }

        return false;
      },
    },
    {
      icon: <UndoIcon size={18} />,
      description: "View Previous version",
      onClick: ({ handleVersionChange }) => {
        handleVersionChange("prev");
      },
      isDisabled: ({ currentVersionIndex }) => {
        if (currentVersionIndex === 0) {
          return true;
        }

        return false;
      },
    },
    {
      icon: <RedoIcon size={18} />,
      description: "查看下一个版本",
      onClick: ({ handleVersionChange }) => {
        handleVersionChange("next");
      },
      isDisabled: ({ isCurrentVersion }) => {
        if (isCurrentVersion) {
          return true;
        }

        return false;
      },
    },
    {
      icon: <CopyIcon size={18} />,
      description: "复制",
      onClick: ({ content }) => {
        navigator.clipboard.writeText(content);
        toast.success("Copied to clipboard!");
      },
    },
  ],
  toolbar: [
    {
      icon: <PenIcon />,
      description: "添加最终润色",
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: "user",
          content:
            "Please add final polish and check for grammar, add section titles for better structure, and ensure everything reads smoothly.",
        });
      },
    },
    {
      icon: <MessageIcon />,
      description: "请求建议",
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: "user",
          content: "Please add suggestions you have that could improve the writing.",
        });
      },
    },
  ],
});
