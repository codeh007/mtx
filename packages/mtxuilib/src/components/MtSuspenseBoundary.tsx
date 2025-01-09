"use client";

import { type PropsWithChildren, type ReactNode, Suspense } from "react";
import type { FallbackProps } from "react-error-boundary";
import { MtErrorBoundary } from "./MtErrorBoundary";
import { SkeletonLoading } from "./skeletons/SkeletonLoading";

interface MtSuspenseBoundaryProps {
  suspenseFallback?: ReactNode;
  errorFallbackRender?: (props: FallbackProps) => ReactNode;
}
export const MtSuspenseBoundary = (
  props: PropsWithChildren<MtSuspenseBoundaryProps>,
) => {
  return (
    <Suspense fallback={props.suspenseFallback || <SkeletonLoading />}>
      <MtErrorBoundary fallbackRender={props.errorFallbackRender}>
        {props.children}
      </MtErrorBoundary>
    </Suspense>
  );
};
