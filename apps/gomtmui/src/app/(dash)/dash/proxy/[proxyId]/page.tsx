"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useTenantId } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { useQuery } from "@tanstack/react-query";
import { proxyGetOptions } from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import { useParams } from "next/navigation";
import { ProxyForm } from "../components/proxy-form";

export default function EditProxyPage() {
	const { proxyId } = useParams<{ proxyId: string }>();
	const tid = useTenantId();
	const { toast } = useToast();

	const { data: proxy, isLoading } = useQuery({
		...proxyGetOptions({
			path: {
				tenant: tid,
				proxyId,
			},
		}),
		enabled: !!tid && !!proxyId,
		onError: () => {
			toast({
				title: "加载失败",
				description: "无法加载代理信息",
				variant: "destructive",
			});
		},
	});

	return (
		<div className="flex-col">
			<div className="flex items-center justify-between">
				<Heading title="编辑代理服务器" description="修改代理服务器信息" />
			</div>
			<Separator className="my-4" />
			{isLoading ? (
				<div className="flex justify-center">
					<div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
				</div>
			) : (
				<ProxyForm initialData={proxy} />
			)}
		</div>
	);
}
