"use client";

import { MtLink } from "../../mt/mtlink";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../../ui/navigation-menu";

export const DashNav = () => {
  return (
    <>
      {/* <nav>
				<MtLink href="/">Home</MtLink>
			</nav> */}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <MtLink href="/" variant={"ghost"}>
              Home
            </MtLink>
            {/* <NavigationMenuTrigger>

						</NavigationMenuTrigger> */}
            {/* <NavigationMenuContent>
							<NavigationMenuLink>Link</NavigationMenuLink>
						</NavigationMenuContent> */}
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-md">
              <MtLink variant={"ghost"} href="/">
                站点
              </MtLink>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              {/* <NavigationMenuLink className="text-md">Link</NavigationMenuLink> */}
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};
