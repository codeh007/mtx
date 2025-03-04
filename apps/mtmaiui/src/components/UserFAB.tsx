"use client";

import { AssistantModal } from "mtxuilib/assistant-ui/assistant-modal";
import { IconX, Icons } from "mtxuilib/icons/icons";
import { logout } from "mtxuilib/lib/auth/auth_actions";
import { cn } from "mtxuilib/lib/utils";
import { Button } from "mtxuilib/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "mtxuilib/ui/dropdown-menu";
import { useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { frontendGetSiderbarOptions } from "mtmaiapi";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { useUser } from "../hooks/useAuth";
import { useBasePath } from "../hooks/useBasePath";
export const UserFAB = () => {
  const [openCmdk, setOpenCmdk] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const basePath = useBasePath();

  const user = useUser();
  const navigate = useNavigate();

  const handleOpenDropdown = () => {
    if (!user) {
      // signin("credentials");
      navigate({
        to: "/auth/login",
      });
    }
    setOpenDropdown(true);
  };
  return (
    <>
      {openCmdk && <AssistantModal />}

      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button
            className={cn(
              "fixed bottom-14 right-4 z-40",
              "bg-tertiary/20 text-tertiary-foreground border border-slate-500 hover:bg-tertiary/10 rounded-lg",
            )}
            onClick={handleOpenDropdown}
          >
            <Icons.apple />
          </Button>
        </DropdownMenuTrigger>
        {user && (
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <UserFABDropdownMenuContent />
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Email</DropdownMenuItem>
                    <DropdownMenuItem>Message</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>More...</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              {/* <DropdownMenuItem>
              New Team
              <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
            </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem>GitHub</DropdownMenuItem> */}
            {/* <DropdownMenuItem>Support</DropdownMenuItem> */}
            {/* <DropdownMenuItem disabled>API</DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </>
  );
};

const UserFABDropdownMenuContent = () => {
  const siderbarQuery = useSuspenseQuery({
    ...frontendGetSiderbarOptions({}),
  });

  if (!siderbarQuery.data?.sideritems) {
    return null;
  }
  return (
    <>
      {siderbarQuery.data?.sideritems?.map((item) => (
        <DropdownMenuGroup key={item.title}>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {item.icon && (
                <IconX name={item.icon} className="size-5 m-0 p-0" />
              )}
              <span className="text-lg font-semibold">{item.title}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {item.children?.map((subItem) => (
                  <CustomLink key={subItem.title} to={subItem.url}>
                    <DropdownMenuItem>
                      <span>{subItem.title}</span>
                    </DropdownMenuItem>
                  </CustomLink>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      ))}
    </>
  );
};
