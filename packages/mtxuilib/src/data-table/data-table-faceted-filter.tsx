"use client";
import { CheckIcon, CircleIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import type { Column } from "@tanstack/react-table";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BiX } from "react-icons/bi";
import { z } from "zod";
import { cn } from "../lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import { ToolbarType } from "./data-table-toolbar";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  type?: ToolbarType;
  options?: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

const keyValuePairSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
});

const arrayInputSchema = z.object({
  values: z.string().min(1, "At least one value is required"),
});

type KeyValuePair = z.infer<typeof keyValuePairSchema>;
type ArrayInput = z.infer<typeof arrayInputSchema>;

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  type = ToolbarType.Checkbox,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  const { register, handleSubmit, reset } = useForm<KeyValuePair | ArrayInput>({
    resolver: zodResolver(
      type === ToolbarType.KeyValue ? keyValuePairSchema : arrayInputSchema,
    ),
    defaultValues:
      type === ToolbarType.KeyValue ? { key: "", value: "" } : { values: "" },
  });

  const onSubmit = (data: KeyValuePair | ArrayInput) => {
    if ("key" in data) {
      selectedValues.add(`${data.key}:${data.value}`);
    } else {
      // biome-ignore lint/complexity/noForEach: <explanation>
      //@ts-ignore
      data.values
        //@ts-ignore
        .split(",")
        //@ts-ignore
        .forEach((value) => selectedValues.add(value.trim()));
    }
    const filterValues = Array.from(selectedValues);
    column?.setFilterValue(filterValues.length ? filterValues : undefined);
    reset();
  };

  const handleRemove = (filter: string) => {
    selectedValues.delete(filter);
    const filterValues = Array.from(selectedValues);
    column?.setFilterValue(filterValues.length ? filterValues : undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  Array.from(selectedValues).map((option, index) => (
                    <Badge
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      key={index}
                      variant="secondary"
                      className="rounded-sm px-1 font-normal flex items-center space-x-1"
                    >
                      {options?.find(({ value }) => value == option)?.label ||
                        option}
                      <Button
                        variant="ghost"
                        size="xs"
                        className="ml-2"
                        onClick={() => handleRemove(option)}
                      >
                        <BiX className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-2" align="start">
        {[ToolbarType.Array, ToolbarType.KeyValue].includes(type) && (
          <div>
            <div className="">
              {Array.from(selectedValues).map((filter, index) => (
                <Badge
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={index}
                  variant="secondary"
                  className="mr-2 mb-2 rounded-sm px-1  flex items-center space-x-1 font-normal pl-2"
                >
                  <span className="grow">{filter}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 shrink-0"
                    onClick={() => handleRemove(filter)}
                  >
                    <BiX className="h-4 w-4" />
                  </Button>
                </Badge>
              ))}
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              {type === ToolbarType.KeyValue ? (
                <div className="flex items-center space-x-2 mb-2">
                  <Input
                    type="text"
                    placeholder="Key"
                    {...register("key")}
                    className="flex-1"
                  />
                  <Input
                    type="text"
                    placeholder="Value"
                    {...register("value")}
                    className="flex-1"
                  />
                </div>
              ) : (
                <div className="mb-2">
                  <Input
                    type="text"
                    placeholder="Enter values (comma-separated)"
                    {...register("values")}
                    className="w-full"
                  />
                </div>
              )}
              <Button type="submit" className="w-full" size="sm">
                Add {title} Filter
              </Button>
              {selectedValues.size > 0 && (
                <Button
                  onClick={() => column?.setFilterValue(undefined)}
                  className="w-full mt-2"
                  size="sm"
                  variant={"ghost"}
                >
                  Reset
                </Button>
              )}
            </form>
          </div>
        )}

        {[ToolbarType.Checkbox, ToolbarType.Radio].includes(type) && (
          <Command>
            <CommandInput placeholder={title} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options?.map((option) => {
                  const isSelected = selectedValues.has(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        if (isSelected) {
                          selectedValues.delete(option.value);
                        } else {
                          if (type === "radio") {
                            selectedValues.clear();
                          }
                          selectedValues.add(option.value);
                        }
                        const filterValues = Array.from(selectedValues);
                        column?.setFilterValue(
                          filterValues.length ? filterValues : undefined,
                        );
                      }}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible",
                        )}
                      >
                        {type === "checkbox" ? (
                          <CheckIcon className={cn("h-4 w-4")} />
                        ) : (
                          <CircleIcon className={cn("h-4 w-4")} />
                        )}
                      </div>
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-gray-700 dark:text-gray-300" />
                      )}
                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {selectedValues.size > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => column?.setFilterValue(undefined)}
                      className="justify-center text-center"
                    >
                      Reset
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
}
