"use client";

import { Skeleton } from "../../ui/skeleton";

export default function NewLoading() {
	return (
		<div className="max-w-4xl mx-auto w-full">
			<div className="my-8">
				<div className="mx-auto  px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<h2 className="text-lg font-semibold text-rose-600">Browse</h2>
						<h1 className="mt-1 text-4xl font-bold tracking-tight text-brandtext-500 sm:text-5xl lg:text-6xl">
							Make your mark
						</h1>
						<p className="mx-auto mt-5 max-w-xl text-xl text-brandtext-600">
							If your contribution is accepted by an Open Source project, you
							get paid! Plus, the street (web) cred.
						</p>
					</div>
				</div>
			</div>
			<div className="mt-12 w-full">
				<Skeleton className="h-6 w-full" />
			</div>
			<div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8">
				<Skeleton className="h-8 w-full" />
				<Skeleton className="h-8 w-full" />
				<Skeleton className="h-8 w-full" />
				<Skeleton className="h-8 w-full" />
				<Skeleton className="h-8 w-full" />
				<Skeleton className="h-8 w-full" />
			</div>
		</div>
	);
}
