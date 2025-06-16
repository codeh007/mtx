"use client";

import { Icons } from "mtxuilib/icons/icons";
import { deleteCookie } from "mtxuilib/lib/clientlib";
import { cn } from "mtxuilib/lib/utils";
import { Button } from "mtxuilib/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "mtxuilib/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTenantId, useUser } from "../hooks/useAuth";

export const UserActions = () => {
	const [openDropdown, setOpenDropdown] = useState(false);
	const user = useUser();
	const tid = useTenantId();
	const router = useRouter();

	const handleLogout = () => {
		deleteCookie("access_token");
		router.push("/");
	};

	return (
		<>
			<DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
				<DropdownMenuTrigger asChild>
					<Button
						className={cn(
							"bg-tertiary/20 text-tertiary-foreground border border-slate-500 hover:bg-tertiary/10 rounded-lg",
							"flex items-center gap-2",
						)}
					>
						<Icons.user className="h-4 w-4" />
						<span className="hidden md:inline-block">
							{user?.email ? user.email.split("@")[0] : "用户"}
						</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-56">
					<DropdownMenuLabel>我的账号</DropdownMenuLabel>
					{user && (
						<>
							<DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
								{user.email}
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
						</>
					)}
					<DropdownMenuItem
						onClick={() => {
							router.push("/dash");
							setOpenDropdown(false);
						}}
					>
						<Icons.dashboard className="mr-2 h-4 w-4" />
						<span>仪表盘</span>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							router.push("/dash/profile");
							setOpenDropdown(false);
						}}
					>
						<Icons.user className="mr-2 h-4 w-4" />
						<span>个人资料</span>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={handleLogout}>
						<Icons.arrowRight className="mr-2 h-4 w-4" />
						<span>退出登录</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
