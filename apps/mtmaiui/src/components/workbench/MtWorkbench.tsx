"use client";

import { type Variants, motion } from "framer-motion";
import { cubicEasingFn } from "mtxuilib/mt/easings";
import { Suspense, memo } from "react";

import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { SkeletonLoading } from "mtxuilib/components/skeletons/SkeletonLoading";
import { cn } from "mtxuilib/lib/utils";
import { AgStateView2 } from "../../routes/~ag_state/components/AgStateView";
import { useWorkbenchStore } from "../../stores/workbrench.store";
export interface WorkspaceProps {
  chatStarted?: boolean;
  isStreaming?: boolean;
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
  ({ chatStarted, isStreaming }: WorkspaceProps) => {
    const showWorkbench = useWorkbenchStore((x) => x.openWorkbench);
    const chatSessionId = useWorkbenchStore((x) => x.threadId);
    return (
      <>
        <motion.div
          initial="closed"
          animate={showWorkbench ? "open" : "closed"}
          variants={workbenchVariants}
          className={cn("z-workbench", {
            "bg-red-100": true,
            "w-0": !showWorkbench,
          })}
        >
          {/* <DebugValue data={{ workbenchViewProps }} /> */}
          <Suspense fallback={<SkeletonLoading />}>
            {/* {currentView?.length > 0 && (
              <WorkbenchView
                isStreaming={isStreaming}
                {...workbenchViewProps}
              />
            )} */}
            <div>
              <MtSuspenseBoundary>
                {chatSessionId && <AgStateView2 chatId={chatSessionId} />}
              </MtSuspenseBoundary>
            </div>
          </Suspense>
        </motion.div>
      </>
    );
  },
);
