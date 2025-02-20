"use client";

import { motion } from "framer-motion";
import { Copy } from "lucide-react";
import { isArtifactCodeContent } from "mtxuilib/lib/artifact_content_types";

import { TooltipIconButton } from "mtxuilib/assistant-ui/tooltip-icon-button";

import { useToast } from "mtxuilib/ui/use-toast";

interface CopyTextProps {
  currentArtifactContent: ArtifactCodeV3 | ArtifactMarkdownV3;
}

export function CopyText(props: CopyTextProps) {
  const { toast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <TooltipIconButton
        tooltip="Copy"
        variant="outline"
        className="transition-colors"
        delayDuration={400}
        onClick={() => {
          try {
            const text = isArtifactCodeContent(props.currentArtifactContent)
              ? props.currentArtifactContent.code
              : props.currentArtifactContent.fullMarkdown;
            navigator.clipboard.writeText(text).then(() => {
              toast({
                title: "Copied to clipboard",
                description: "The canvas content has been copied.",
                duration: 5000,
              });
            });
          } catch (_) {
            toast({
              title: "Copy error",
              description:
                "Failed to copy the canvas content. Please try again.",
              duration: 5000,
            });
          }
        }}
      >
        <Copy className="w-5 h-5 text-gray-600" />
      </TooltipIconButton>
    </motion.div>
  );
}
