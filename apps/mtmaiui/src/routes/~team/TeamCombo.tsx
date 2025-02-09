"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { teamListOptions } from "mtmaiapi";
import { cn } from "mtxuilib/lib/utils";
import { Button } from "mtxuilib/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "mtxuilib/ui/command";
import type { InputProps } from "mtxuilib/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "mtxuilib/ui/popover";
import { useState } from "react";
import { useTenant } from "../../hooks/useAuth";

export function TeamCombo(props: InputProps) {
  const { defaultValue, onChange } = props;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>(defaultValue as string);
  const tenant = useTenant();

  const teamsQuery = useSuspenseQuery({
    ...teamListOptions({
      path: {
        tenant: tenant!.metadata.id,
      },
    }),
  });

  const handleChange = (value: string) => {
    setValue(value);
    onChange?.(value as any);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? teamsQuery.data?.rows?.find((row) => row.metadata.id === value)
                ?.component?.label || "no name agent"
            : "选择团队"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="搜索团队..." className="h-9" />
          <CommandList>
            <CommandEmpty>没有找到团队</CommandEmpty>
            <CommandGroup>
              {teamsQuery.data?.rows?.map((team) => (
                <CommandItem
                  key={team.metadata.id}
                  value={team.metadata.id}
                  onSelect={(currentValue) => {
                    handleChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {team.component.label ?? team.component.provider}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === team.metadata.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
