"use client";

import { TooltipContent } from "@radix-ui/react-tooltip";
import { useState } from "react";
import { Icons } from "../../icons/icons";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Tooltip, TooltipTrigger } from "../../ui/tooltip";

export const DebugValue = (props: {
  title?: string;
  data;
  className?: string;
}) => {
  const { title, data, className } = props;

  const [open, setOpen] = useState(false);
  if (process.env.NODE_ENV === "production") {
    return null;
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size={"icon"}
              variant={"outline"}
              className={className}
              onClick={() => {
                setOpen(!open);
                console.log(data);
              }}
            >
              <Icons.bug className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{title}</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="max-h-lvh w-full overflow-scroll min-w-xl ">
        <DialogTitle>{title}</DialogTitle>

        <DialogHeader>
          <DialogDescription className="text-sm"> </DialogDescription>
        </DialogHeader>
        <pre className=" text-xs">{JSON.stringify(data, null, 2)}</pre>
      </DialogContent>
    </Dialog>
  );
};
