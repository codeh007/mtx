"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

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
import { Popover, PopoverContent, PopoverTrigger } from "mtxuilib/ui/popover";

const componentTypes = [
  {
    value: "RoundRobinGroupChat",
    label: "轮询群聊",
  },
  {
    value: "SelectorGroupChat",
    label: "选择群聊",
  },
  {
    value: "Assisant",
    label: "助手",
  },
  {
    value: "MagenticOneGroupChat",
    label: "磁力一号",
  },
  {
    value: "instagramTeam",
    label: "Instagram团队",
  },
];

export function ModelSelect(props: React.ComponentProps<"input">) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          // biome-ignore lint/a11y/useSemanticElements: <explanation>
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? componentTypes.find((framework) => framework.value === value)
                ?.label
            : "选择组件类型"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="选择组件类型" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {componentTypes.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    props.onChange?.(currentValue as any);
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value ? "opacity-100" : "opacity-0",
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
