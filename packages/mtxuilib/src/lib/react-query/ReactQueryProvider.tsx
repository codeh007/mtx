"use client";
import { type PropsWithChildren, useMemo } from "react";

import {
	QueryClient,
	QueryClientProvider,
	QueryErrorResetBoundary,
	useQueryErrorResetBoundary,
} from "@tanstack/react-query";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { ErrorBoundary } from "react-error-boundary";

export const MtReactQueryProvider = (props: PropsWithChildren) => {
	const { children } = props;

	const queryClient = useMemo(() => {
		return new QueryClient({
			defaultOptions: {
				queries: {
					refetchOnWindowFocus: false, // default: true
					// staleTime: Number.POSITIVE_INFINITY,
					staleTime: 60 * 1000,
					refetchOnMount: false,
					refetchOnReconnect: false,
					retry: false,
				},
			},
		});
	}, []);
	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
		</QueryClientProvider>
	);
};

export function RqErrorBoundary(props: PropsWithChildren) {
	const { children } = props;
	return (
		<>
			<QueryErrorResetBoundary>
				{children}
				{/* 暂时取消 ErrorBoundary */}
				{/* {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary, error }) => (
            <div className='green-red-100 prose dark:prose-invert container mx-auto p-8 text-lg'>
              <div className=' pb-8 text-center'>some thing error</div>
              <div>{error?.toString()}</div>
              <div className='flex items-center justify-center p-8'>
                <button onClick={() => resetErrorBoundary()}>Retry</button>
              </div>
            </div>
          )}
        >
          {children}
        </ErrorBoundary>
      )} */}
			</QueryErrorResetBoundary>
		</>
	);
}

export function RqErrorBoundaryUseHook(props: PropsWithChildren) {
	const { reset } = useQueryErrorResetBoundary();
	return (
		<ErrorBoundary
			onReset={reset}
			fallbackRender={({ resetErrorBoundary }) => (
				<div>
					<div>There was an error（RqErrorBoundaryUseHook）!</div>
					{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
					<button onClick={() => resetErrorBoundary()}>Try again</button>
				</div>
			)}
		>
			{props.children}
		</ErrorBoundary>
	);
}
