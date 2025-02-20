import {
  Bot,
  GalleryHorizontalEnd,
  MessagesSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Rocket,
  Settings,
} from "lucide-react";
import { Button } from "mtxuilib/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "mtxuilib/ui/tooltip";
import React from "react";
import { CustomLink } from "../../components/CustomLink";
import { useGraphStore } from "../../stores/GraphContext";
import { Icon } from "./icons";
interface INavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  breadcrumbs?: Array<{
    name: string;
    href: string;
    current?: boolean;
  }>;
}

const navigation: INavItem[] = [
  {
    name: "Team Builder",
    href: "/build",
    icon: Bot,
    breadcrumbs: [{ name: "Team Builder", href: "/build", current: true }],
  },
  {
    name: "Playground",
    href: "/",
    icon: MessagesSquare,
    breadcrumbs: [{ name: "Playground", href: "/", current: true }],
  },
  {
    name: "Gallery",
    href: "/gallery",
    icon: GalleryHorizontalEnd,
    breadcrumbs: [{ name: "Gallery", href: "/gallery", current: true }],
  },
  {
    name: "Deploy",
    href: "/deploy",
    icon: Rocket,
    breadcrumbs: [{ name: "Deploy", href: "/deploy", current: true }],
  },
];

const classNames = (...classes: (string | undefined | boolean)[]) => {
  return classes.filter(Boolean).join(" ");
};

type SidebarProps = {
  link: string;
  meta?: {
    title: string;
    description: string;
  };
  isMobile: boolean;
};

export const Sidebar = ({ link, meta, isMobile }: SidebarProps) => {
  // const { sidebar, setHeader, setSidebarState } = useConfigStore();

  const sidebar = useGraphStore((x) => x.sidebar);
  const setSidebarState = useGraphStore((x) => x.setSidebarState);
  const setHeader = useGraphStore((x) => x.setHeader);
  const isExpanded = useGraphStore((x) => x.sidebar.isExpanded);

  // Set initial header state based on current route
  React.useEffect(() => {
    setNavigationHeader(link);
  }, [link]);

  // Always show full sidebar in mobile view
  const showFull = isMobile || isExpanded;

  const handleNavClick = (item: INavItem) => {
    // if (!isExpanded) {
    //   setSidebarState({ isExpanded: true });
    // }
    setHeader({
      title: item.name,
      breadcrumbs: item.breadcrumbs,
    });
  };

  const setNavigationHeader = (path: string) => {
    const navItem = navigation.find((item) => item.href === path);
    if (navItem) {
      setHeader({
        title: navItem.name,
        breadcrumbs: navItem.breadcrumbs,
      });
    } else if (path === "/settings") {
      setHeader({
        title: "Settings",
        breadcrumbs: [{ name: "Settings", href: "/settings", current: true }],
      });
    }
  };

  return (
    <div
      className={classNames(
        "flex grow flex-col gap-y-5 overflow-y-auto border-r border-secondary bg-primary",
        "transition-all duration-300 ease-in-out",
        showFull ? "w-72 px-6" : "w-16 px-2",
      )}
    >
      {/* App Logo/Title */}
      <div
        className={`flex h-16 items-center ${showFull ? "gap-x-3" : "ml-2"}`}
      >
        <CustomLink
          to="/"
          onClick={() => setNavigationHeader("/")}
          className="w-8 text-right text-accent hover:opacity-80 transition-opacity"
        >
          <Icon icon="app" size={8} />
        </CustomLink>
        {showFull && (
          <div className="flex flex-col" style={{ minWidth: "200px" }}>
            <span className="text-base font-semibold text-primary">
              {meta?.title}
            </span>
            <span className="text-xs  ">{meta?.description}</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          {/* Main Navigation */}
          <li>
            <ul
              role="list"
              className={classNames(
                "-mx-2 space-y-1",
                !showFull && "items-center",
              )}
            >
              {navigation.map((item) => {
                const isActive = item.href === link;
                const IconComponent = item.icon;

                const navLink = (
                  <div className="relative">
                    {isActive && (
                      <div className="bg-accent absolute top-1 left-0.5 z-50 h-8 w-1 bg-opacity-80  rounded">
                        {" "}
                      </div>
                    )}
                    <CustomLink
                      to={item.href}
                      onClick={() => handleNavClick(item)}
                      className={classNames(
                        // Base styles
                        "group  ml-1 flex gap-x-3 rounded-md mr-2  p-2 text-sm font-medium",
                        !showFull && "justify-center",
                        // Color states
                        isActive
                          ? "bg-secondary text-primary "
                          : "  hover:bg-tertiary hover:text-accent",
                      )}
                    >
                      {" "}
                      <IconComponent
                        className={classNames(
                          "h-6 w-6 shrink-0",
                          isActive
                            ? "text-accent"
                            : "  group-hover:text-accent",
                        )}
                      />
                      {showFull && item.name}
                    </CustomLink>
                  </div>
                );

                return (
                  <li key={item.name}>
                    {!showFull && !isMobile ? (
                      <Tooltip placement="right">
                        <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                        <TooltipContent>
                          <p>{item.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      navLink
                    )}
                  </li>
                );
              })}
            </ul>
          </li>

          {/* Settings at bottom */}
          <li
            className={classNames(
              "mt-auto -mx-2 mb-4",
              !showFull && "flex flex-col items-center gap-1",
            )}
          >
            {!showFull && !isMobile ? (
              <>
                <Tooltip placement="right">
                  <TooltipTrigger asChild>
                    <CustomLink
                      to="/settings"
                      onClick={() =>
                        setHeader({
                          title: "Settings",
                          breadcrumbs: [
                            {
                              name: "Settings",
                              href: "/settings",
                              current: true,
                            },
                          ],
                        })
                      }
                      className="group flex gap-x-3 rounded-md p-2 text-sm font-medium text-primary hover:text-accent hover:bg-secondary justify-center"
                    >
                      <Settings className="h-6 w-6 shrink-0   group-hover:text-accent" />
                    </CustomLink>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
                <div className="hidden md:block">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() =>
                          setSidebarState({ isExpanded: !isExpanded })
                        }
                        className="p-2 rounded-md hover:bg-secondary hover:text-accent   transition-colors focus:outline-hidden focus:ring-2 focus:ring-accent focus:ring-opacity-50"
                      >
                        {isExpanded ? (
                          <PanelLeftClose
                            strokeWidth={1.5}
                            className="h-6 w-6"
                          />
                        ) : (
                          <PanelLeftOpen
                            strokeWidth={1.5}
                            className="h-6 w-6"
                          />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isExpanded ? "Close Sidebar" : "Open Sidebar"}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-full  ">
                  <div className="hidden">
                    {" "}
                    <CustomLink
                      to="/settings"
                      onClick={() =>
                        setHeader({
                          title: "Settings",
                          breadcrumbs: [
                            {
                              name: "Settings",
                              href: "/settings",
                              current: true,
                            },
                          ],
                        })
                      }
                      className="group flex flex-1 gap-x-3 rounded-md p-2 text-sm font-medium text-primary hover:text-accent hover:bg-secondary"
                    >
                      <Settings className="h-6 w-6 shrink-0   group-hover:text-accent" />
                      {showFull && "Settings"}
                    </CustomLink>
                  </div>
                </div>
                <div className="hidden md:block">
                  <Tooltip placement="right">
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() =>
                          setSidebarState({ isExpanded: !isExpanded })
                        }
                        className="p-2 rounded-md hover:bg-secondary hover:text-accent   transition-colors focus:outline-hidden focus:ring-2 focus:ring-accent focus:ring-opacity-50"
                      >
                        {isExpanded ? (
                          <PanelLeftClose
                            strokeWidth={1.5}
                            className="h-6 w-6"
                          />
                        ) : (
                          <PanelLeftOpen
                            strokeWidth={1.5}
                            className="h-6 w-6"
                          />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isExpanded ? "Close Sidebar" : "Open Sidebar"}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};
