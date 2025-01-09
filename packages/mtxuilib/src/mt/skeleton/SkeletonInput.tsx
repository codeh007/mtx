import type { InputProps } from "../../ui/input";
import { Skeleton } from "../../ui/skeleton";

interface SkeletonInputProps extends InputProps {}
export function SkeletonInput(props: SkeletonInputProps) {
	return (
		<div
			// className={cn("border-input h-9 w-full rounded-md border px-3 py-1 shadow-sm")}
			className="flex flex-col"
		>
			<Skeleton className="h-9 w-full rounded-md border px-3 py-1 shadow-sm" />
		</div>
	);
}
