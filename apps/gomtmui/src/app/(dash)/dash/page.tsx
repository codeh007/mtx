import { getAppConfig } from "@mtmaiui/lib/config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "mtxuilib/ui/card";
import { cookies } from "next/headers";
import { PageContainer } from "./components/PageContainer";

export default async function DashPage() {
	const config = getAppConfig();
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("access_token")?.value;

	return (
		<PageContainer
			title="仪表盘"
			description="欢迎使用 GOMTM 管理系统"
		>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">站点总数</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">--</div>
						<p className="text-xs text-muted-foreground">
							暂未实现统计功能
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">文章总数</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">--</div>
						<p className="text-xs text-muted-foreground">
							暂未实现统计功能
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">代理数量</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">--</div>
						<p className="text-xs text-muted-foreground">
							暂未实现统计功能
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">系统状态</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">正常</div>
						<p className="text-xs text-muted-foreground">
							所有服务运行正常
						</p>
					</CardContent>
				</Card>
			</div>
		</PageContainer>
	);
}
