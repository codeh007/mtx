"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { ProxyForm } from "../components/proxy-form";

export default function NewProxyPage() {
	const router = useRouter();

	return (
		<div className="flex-col">
			<div className="flex items-center justify-between">
				<Heading title="创建代理服务器" description="添加新的代理服务器" />
			</div>
			<Separator className="my-4" />
			<ProxyForm />
		</div>
	);
}
