"use client";

import { type Variants, motion } from "framer-motion";
import { cubicEasingFn } from "mtxuilib/mt/easings";
import { memo } from "react";

import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { cn } from "mtxuilib/lib/utils";
export interface WorkspaceProps {
  chatStarted?: boolean;
  isStreaming?: boolean;
  outlet?: React.ReactNode;
}

export const workbenchVariants = {
  closed: {
    width: 0,
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
  open: {
    width: "var(--workbench-width)",
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
} satisfies Variants;

export const MtWorkbench = memo(
  ({ chatStarted, isStreaming, outlet }: WorkspaceProps) => {
    // const showWorkbench = useWorkbenchStore((x) => x.openWorkbench);
    return (
      <>
        <motion.div
          initial="closed"
          // animate={showWorkbench ? "open" : "closed"}
          variants={workbenchVariants}
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
