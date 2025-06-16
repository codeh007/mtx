"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTenantId } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { useMutation } from "@tanstack/react-query";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { proxyDeleteMutation } from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import type { Proxy as ProxyType } from "mtmaiapi/gomtmapi/types.gen";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProxyActionsProps {
	proxy: ProxyType;
	onSuccess?: () => void;
}

export function ProxyActions({ proxy, onSuccess }: ProxyActionsProps) {
	const router = useRouter();
	const { toast } = useToast();
	const tid = useTenantId();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const deleteProxyMutation = useMutation({
		...proxyDeleteMutation({
			path: {
				tenant: tid,
				proxyId: proxy.id,
			},
		}),
		onMutate: () => {
			setLoading(true);
		},
		onSuccess: () => {
			toast({
				title: "删除成功",
				description: "代理服务器已删除",
			});
			onSuccess?.();
			setOpen(false);
		},
		onError: () => {
			toast({
				title: "删除失败",
				description: "无法删除代理服务器",
				variant: "destructive",
			});
		},
		onSettled: () => {
			setLoading(false);
		},
	});

	const onDelete = () => {
		deleteProxyMutation.mutate();
	};

	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">打开菜单</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>操作</DropdownMenuLabel>
					<DropdownMenuItem
						onClick={() => router.push(`/dash/proxy/${proxy.id}`)}
					>
						<Edit className="mr-2 h-4 w-4" />
						编辑
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setOpen(true)}>
						<Trash className="mr-2 h-4 w-4" />
						删除
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
