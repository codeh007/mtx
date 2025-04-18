"use client";

import { Icons } from "../../icons/icons";

interface SkeletonLoadingProps {
	loading?: boolean;
}
export const SkeletonListview = ({ loading }: SkeletonLoadingProps) => {
	return (
		<div className="flex mx-auto justify-center items-center h-screen">
			<div className="text-bolt-elements-textPrimary flex-1 flex flex-col items-center">
				<Icons.reload className="size-6 animate-spin" />
			</div>
		</div>
	);
};
