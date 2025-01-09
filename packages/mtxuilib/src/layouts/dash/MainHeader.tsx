"use client";
import {
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  ShoppingCart,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "../../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";
import { DashNav } from "./nav";

export const MainHeader = () => {
  return (
    <header
      // className={cn(
      // 	"bg-background sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 pt-1 ",
      // 	"sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6",
      // 	"fixed top-0 left-0",
      // 	"bg-slate-200",
      // )}
      className="sticky top-0 flex h-14 items-center gap-4 border-b px-4 pt-1 "
    >
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="bg-primary text-primary-foreground group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:text-base"
            >
              <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Acme Inc</span>
            </Link>
            {/* {menus.children?.map((menu, i) => {
							return (
								<Link
									key={i}
									href="#"
									className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
								>
									<Home className="h-5 w-5" />
									{menu.label}
								</Link>
							);
						})} */}
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
            >
              <Home className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="#"
              className="text-foreground flex items-center gap-4 px-2.5"
            >
              <ShoppingCart className="h-5 w-5" />
              Orders
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
            >
              <Package className="h-5 w-5" />
              Products
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
            >
              <Users2 className="h-5 w-5" />
              Customers
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
            >
              <LineChart className="h-5 w-5" />
              Settings
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      {/* 暂时去掉面包屑导航，应该感觉有点多余 */}
      {/* <DashBreadcrumb /> */}
      <div className="flex-1">{/* <SearchInput /> */}</div>
      <div className="flex-1">
        <DashNav />
      </div>
      <Suspense>{/* <UserAvatorMenus /> */}</Suspense>
    </header>
  );
};
