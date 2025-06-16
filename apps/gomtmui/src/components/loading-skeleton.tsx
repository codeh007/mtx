import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
	return (
		<div className="flex flex-col space-y-4 p-4">
			<Skeleton className="h-8 w-1/3" />
			<div className="space-y-2">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-5/6" />
				<Skeleton className="h-4 w-4/6" />
			</div>
		</div>
	);
}

export function TableLoadingSkeleton() {
	return (
		<div className="flex flex-col space-y-4 p-4">
			<Skeleton className="h-8 w-1/3 mb-6" />
			<div className="space-y-2">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
			</div>
		</div>
	);
}

export function CardLoadingSkeleton() {
	return (
		<div className="flex flex-col space-y-4 p-4">
			<Skeleton className="h-8 w-1/4" />
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Skeleton className="h-[200px] w-full" />
				<Skeleton className="h-[200px] w-full" />
			</div>
		</div>
	);
}

export default LoadingSkeleton;
