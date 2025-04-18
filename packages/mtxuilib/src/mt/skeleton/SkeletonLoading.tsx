import { Skeleton } from "../../ui/skeleton";

export function SkeletonLoading() {
	return (
		<div className="mx-auto flex h-full w-full flex-col items-center justify-center rounded-md">
			<div className="flex-1">
				<Skeleton className="h-9 w-full rounded-md border px-3 py-1 shadow-sm" />
				loading
			</div>
		</div>
	);
}
