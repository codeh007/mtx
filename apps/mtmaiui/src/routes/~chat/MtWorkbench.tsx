"use client";

import { motion } from "framer-motion";
import { memo } from "react";

import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { cn } from "mtxuilib/lib/utils";
export interface WorkspaceProps {
  chatStarted?: boolean;
  isStreaming?: boolean;
  outlet?: React.ReactNode;
}

export const MtWorkbench = memo(
  ({ chatStarted, isStreaming, outlet }: WorkspaceProps) => {
    return (
      <>
        <motion.div
          // initial="closed"
          // animate={showWorkbench ? "open" : "closed"}
          // variants={workbenchVariants}
          className={cn("z-workbench min-w-64", {
            // "w-0": !showWorkbench,
            // "min-w-64": showWorkbench,
          })}
        >
          <MtSuspenseBoundary>{outlet}</MtSuspenseBoundary>
        </motion.div>
      </>
    );
  },
);
