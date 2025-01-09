import type { PropsWithChildren, ReactNode } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Button } from "../ui/button";

export const DefaultErrorRender = ({
  error,
  resetErrorBoundary,
}: FallbackProps) => {
  console.log("💥💥💥", error);
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Button onClick={() => resetErrorBoundary()} className="min-w-24 p-4">
        重试
      </Button>
    </div>
  );
};

export const MtErrorBoundary = (
  props: {
    fallbackRender?: (props: FallbackProps) => ReactNode;
  } & PropsWithChildren,
) => {
  const { children } = props;
  return (
    <ErrorBoundary
      fallbackRender={props.fallbackRender || DefaultErrorRender}
      onReset={() => {}}
    >
      {children}
    </ErrorBoundary>
  );
};
