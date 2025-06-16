"use client";

import { UserActions } from "@/components/UserActions";
import { Icons } from "mtxuilib/icons/icons";
import { cn } from "mtxuilib/lib/utils";
import { Button } from "mtxuilib/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "mtxuilib/ui/breadcrumb";
import { Separator } from "mtxuilib/ui/separator";
import { ThemeToggle } from "./ThemeToggle";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger,
} from "mtxuilib/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navigationItems = [
	{
		title: "概览",
		items: [
			{
				title: "首页",
				url: "/dash",
				icon: Icons.dashboard,
			},
		],
	},
	{
		title: "内容管理",
		items: [
			{
				title: "站点管理",
				url: "/dash/site",
				icon: Icons.settings,
			},
			{
				title: "文章管理",
				url: "/dash/post",
				icon: Icons.post,
			},
		],
	},
	{
		title: "系统管理",
		items: [
			{
				title: "账号管理",
				url: "/dash/p_account",
				icon: Icons.user,
			},
			{
				title: "代理管理",
				url: "/dash/proxy",
				icon: Icons.settings,
			},
			{
				title: "出站管理",
				url: "/dash/outbound",
				icon: Icons.arrowRight,
			},
		],
	},
];

interface DashboardLayoutProps {
	children: ReactNode;
}

// 生成面包屑导航
function generateBreadcrumbs(pathname: string) {
	const pathSegments = pathname.split('/').filter(Boolean);
	const breadcrumbs = [{ title: '首页', href: '/dash' }];

	if (pathSegments.length > 1) {
		const currentPage = navigationItems
			.flatMap(group => group.items)
			.find(item => item.url === pathname);

		if (currentPage) {
			breadcrumbs.push({ title: currentPage.title, href: pathname });
		}
	}

	return breadcrumbs;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
	const pathname = usePathname();
	const breadcrumbs = generateBreadcrumbs(pathname);

	return (
		<SidebarProvider>
			<Sidebar variant="inset">
				<SidebarHeader>
					<div className="flex items-center gap-2 px-4 py-2">
						<Link href="/dash" className="flex items-center space-x-2">
							<Icons.logo className="h-6 w-6" />
							<span className="font-bold text-lg">GOMTM</span>
						</Link>
					</div>
				</SidebarHeader>
				<SidebarContent>
					{navigationItems.map((group) => (
						<SidebarGroup key={group.title}>
							<SidebarGroupLabel>{group.title}</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{group.items.map((item) => {
										const Icon = item.icon;
										const isActive = pathname === item.url;
										return (
											<SidebarMenuItem key={item.title}>
												<SidebarMenuButton asChild isActive={isActive}>
													<Link href={item.url}>
														<Icon className="h-4 w-4" />
														<span>{item.title}</span>
													</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
										);
									})}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					))}
				</SidebarContent>
				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
							<div className="flex items-center justify-between w-full">
								<UserActions />
								<ThemeToggle />
							</div>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
				<SidebarRail />
			</Sidebar>
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<Breadcrumb>
							<BreadcrumbList>
								{breadcrumbs.map((crumb, index) => (
									<BreadcrumbItem key={crumb.href}>
										{index === breadcrumbs.length - 1 ? (
											<BreadcrumbPage>{crumb.title}</BreadcrumbPage>
										) : (
											<>
												<BreadcrumbLink href={crumb.href}>
													{crumb.title}
												</BreadcrumbLink>
												<BreadcrumbSeparator />
											</>
										)}
									</BreadcrumbItem>
								))}
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					<main className="flex-1">
						{children}
					</main>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
