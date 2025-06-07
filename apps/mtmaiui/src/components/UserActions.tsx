"use client";

import { Icons } from "mtxuilib/icons/icons";
import { cn } from "mtxuilib/lib/utils";
import { Button } from "mtxuilib/ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "mtxuilib/ui/dropdown-menu";
import { useState } from "react";

import { useTenantId, useUser } from "../hooks/useAuth";
export const UserActions = () => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const user = useUser();
  const tid = useTenantId();

  return (
    <>
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button
            className={cn(
              // "fixed bottom-14 right-4 z-40",
              "bg-tertiary/20 text-tertiary-foreground border border-slate-500 hover:bg-tertiary/10 rounded-lg",
            )}
            // onClick={handleOpenDropdown}
          >
            <Icons.user />
            {/* <div>
              user:<pre>{JSON.stringify(user, null, 2)}</pre>
              tid:<pre>{tid}</pre>
            </div> */}
          </Button>
        </DropdownMenuTrigger>
      </DropdownMenu>
    </>
  );
};
