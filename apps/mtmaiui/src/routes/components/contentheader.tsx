import { BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Menu as MenuIcon } from "lucide-react";
import { Button } from "mtxuilib/ui/button";

type ContentHeaderProps = {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
};

const classNames = (...classes: (string | undefined | boolean)[]) => {
  return classes.filter(Boolean).join(" ");
};

export const ContentHeader = ({
  onMobileMenuToggle,
  isMobileMenuOpen,
}: ContentHeaderProps) => {
  return (
    <div className="sticky top-0 z-40 bg-primary border-b border-secondary">
      <div className="flex h-16 items-center gap-x-4 px-4">
        {/* Mobile Menu Button */}
        <Button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-md hover:bg-secondary   hover:text-accent transition-colors"
          aria-label="Toggle mobile menu"
        >
          <MenuIcon className="h-6 w-6" />
        </Button>

        {/* Desktop Sidebar Toggle - Hidden on Mobile */}
        {/* <div className="hidden md:block">
          <Tooltip title={isExpanded ? "Close Sidebar" : "Open Sidebar"}>
            <button
              onClick={() => setSidebarState({ isExpanded: !isExpanded })}
              className={classNames(
                "p-2 rounded-md hover:bg-secondary",
                "hover:text-accent   transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50"
              )}
            >
              {isExpanded ? (
                <PanelLeftClose strokeWidth={1.5} className="h-6 w-6" />
              ) : (
                <PanelLeftOpen strokeWidth={1.5} className="h-6 w-6" />
              )}
            </button>
          </Tooltip>
        </div> */}

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          {/* Breadcrumbs */}
          <div className="flex flex-1 items-center min-w-0">
            {/* {breadcrumbs && breadcrumbs.length > 0 ? (
              <nav aria-label="Breadcrumb" className="flex">
                <ol role="list" className="flex items-center space-x-4">
                  {breadcrumbs.map((page, index) => (
                    <li key={page.name}>
                      <div className="flex items-center">
                        {index > 0 && (
                          <svg
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                            className="size-5 shrink-0  "
                          >
                            <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                          </svg>
                        )}
                        <CustomLink
                          to={page.href}
                          aria-current={page.current ? "page" : undefined}
                          className={classNames(
                            "text-sm font-medium",
                            index > 0 ? "ml-4" : "",
                            page.current
                              ? "text-primary"
                              : "  hover:text-accent",
                          )}
                        >
                          {page.name}
                        </CustomLink>
                      </div>
                    </li>
                  ))}
                </ol>
              </nav>
            ) : (
              <h1 className="text-lg font-medium text-primary">{title}</h1>
            )} */}
          </div>

          {/* Right side header items */}
          <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
            {/* Search */}
            <form className="relative flex hidden h-8">
              <label htmlFor="search-field" className="sr-only">
                Search
              </label>
              <MagnifyingGlassIcon className="pointer-events-none absolute inset-y-0 left-2 h-full w-5  " />
              <input
                id="search-field"
                type="search"
                placeholder="Search..."
                className="block h-full w-full border-0 bg-primary py-0 pl-10 pr-0 text-primary placeholder:  focus:ring-0 sm:text-sm"
              />
            </form>

            {/* Dark Mode Toggle */}
            {/* Notifications */}
            <Button className="  hidden hover:text-primary">
              <BellIcon className="h-6 w-6" />
            </Button>

            {/* Separator */}
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-secondary" />

            {/* User */}
          </div>
        </div>
      </div>
    </div>
  );
};
