"use client";

import { AssistantModal } from "mtxuilib/assistant-ui/assistant-modal";
import { Icons } from "mtxuilib/icons/icons";
import { Button } from "mtxuilib/ui/button";
import { useState } from "react";

// import { useLogout } from "../hooks/useAuth";
import { logout } from "mtxuilib/lib/auth/auth_actions";
import { cn } from "mtxuilib/lib/utils";
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
import { useSession } from "next-auth/react";

import { useBasePath } from "../hooks/useBasePath";
import { CustomLink } from "./CustomLink";
export const UserFAB = () => {
  const [openCmdk, setOpenCmdk] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const basePath = useBasePath();

  const { data: session, update } = useSession();
  // const { logout } = useLogout();
  return (
    <>
      {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
      {openCmdk && <AssistantModal />}

      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button
            className={cn(
              "fixed bottom-14 right-4 z-40",
              "bg-tertiary/20 text-tertiary-foreground border border-slate-500 hover:bg-tertiary/10 rounded-lg",
            )}
            onClick={() => {
              setOpenDropdown(true);
            }}
          >
            <Icons.apple />
          </Button>
        </DropdownMenuTrigger>
        {session && (
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <CustomLink to={`${basePath}/posts`}>
                <DropdownMenuItem>
                  posts
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </CustomLink>

              <CustomLink to={`${basePath}/workflows`}>
                <DropdownMenuItem>
                  workflows
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>
              </CustomLink>
              <CustomLink to={"/chat"}>
                <DropdownMenuItem>
                  chat
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>
              </CustomLink>
            </DropdownMenuGroup>
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
