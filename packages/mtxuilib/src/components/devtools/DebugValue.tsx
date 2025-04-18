"use client";

import { useMemo, useState } from "react";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

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

  const jsonFull = useMemo(() => JSON.stringify(data, null, 2), [data]);
  const jsonSummary = useMemo(() => JSON.stringify(data, null, 2), [data]);

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
          <TooltipContent>{jsonSummary}</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="max-h-lvh w-full overflow-scroll min-w-xl ">
        <DialogTitle>{title}</DialogTitle>
        <DialogHeader>
          <DialogDescription className="text-sm"> </DialogDescription>
        </DialogHeader>
        <pre className=" text-xs">{jsonFull}</pre>
      </DialogContent>
    </Dialog>
  );
};
