"use client";

import { MtErrorBoundary } from "mtxuilib/components/MtErrorBoundary";
import { SkeletonListview } from "mtxuilib/components/skeletons/SkeletonListView";
import { Suspense } from "react";

export const DashContent = (props: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-1 flex-col">
      <Suspense fallback={<SkeletonListview />}>
        <MtErrorBoundary>{props.children}</MtErrorBoundary>
      </Suspense>
    </div>
  );
};
