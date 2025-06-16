"use client";

import { UserActions } from "@/components/UserActions";
import { Icons } from "mtxuilib/icons/icons";
import { cn } from "mtxuilib/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DashNavs = [
	{
		label: "首页",
		href: "/dash",
	},
	{
		label: "站点管理",
		href: "/dash/site",
	},
	{
		label: "文章管理",
		href: "/dash/post",
	},
	{
		label: "账号管理",
		href: "/dash/p_account",
	},
	{
		label: "代理管理",
		href: "/dash/proxy",
	},
	{
		label: "出站管理",
		href: "/dash/outbound",
	},
];

export default function DashHeader() {
	const pathname = usePathname();

	return (
		<header
			className={cn(
				"bg-background sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4",
				"w-full",
			)}
		>
			<div className="flex items-center mr-6">
				<Link href="/dash" className="flex items-center space-x-2">
					<Icons.logo className="h-6 w-6" />
					<span className="font-bold text-xl">GOMTM</span>
				</Link>
			</div>
			<div className="flex-1">
				<nav className="flex gap-6">
					{DashNavs.map((nav) => (
						<Link
							key={nav.href}
							href={nav.href}
							className={cn(
								"text-sm font-medium transition-colors hover:text-primary",
								pathname === nav.href
									? "text-primary font-bold"
									: "text-muted-foreground",
							)}
						>
							{nav.label}
						</Link>
					))}
				</nav>
			</div>
			<UserActions />
		</header>
	);
}
