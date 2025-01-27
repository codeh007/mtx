import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { type PlatformAccount, platformAccountListOptions } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";

export const Route = createLazyFileRoute("/platform-account/")({
	component: RouteComponent,
});

function RouteComponent() {
	const query = useSuspenseQuery({
		...platformAccountListOptions({
			// path: {
			// 	tenant: tenant!.metadata.id,
			// },
		}),
	});
	return (
		<div className="flex flex-col h-full w-full ">
			<h1>platformAccount</h1>
			<div>
				{/* 工具栏 */}
				<div>
					<Button>新建</Button>
				</div>
			</div>

			<div>
				{/* 响应式列表视图 */}
				{query.data?.rows?.map((item) => (
					<PlatformAccountListItem key={item.metadata.id} item={item} />
				))}
			</div>
		</div>
	);
}

function PlatformAccountListItem({ item }: { item: PlatformAccount }) {
	return <div>{item.metadata.id}</div>;
}
