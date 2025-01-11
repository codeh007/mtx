"use client";

import { MtErrorBoundary } from "mtxuilib/components/MtErrorBoundary";
import { Skeleton } from "mtxuilib/ui/skeleton";
import { Suspense } from "react";

export default function Page(props: { params: { taskId: string } }) {
  const { taskId } = props.params;
  return (
    <>
      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <MtErrorBoundary>
          {/* <StepArtifactsLayout taskId={taskId} /> */}
        </MtErrorBoundary>
      </Suspense>
    </>
  );
}
