"use client";
import { Label } from "@radix-ui/react-context-menu";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import React from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "../../../lib/utils";
import { FormControl } from "../../../ui/form";
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  kind?: string;
}

export const InputSelectField = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      name,
      label,
      className,
      type,
      placeholder,
      defaultValue,
      value,
      kind,
      ...rest
    },
    ref,
  ) => {
    const methods = useFormContext();
    const handleValueChange = (value: any) => {
      methods.setValue(name, value);
    };
    return (
      <>
        <div
          className={cn(
            "group relative my-2",
            "flex flex-1 items-center justify-center",
            // "max-w-[fit-content]",
          )}
        >
          <Select
            name={name}
            onValueChange={handleValueChange}
            // value={methods.getValues(name) as string}
            defaultValue={methods.getValues(name) as string}
          >
            <FormControl
              className={cn(
                " border-input-none peer px-4 outline-none focus-visible:ring-0",
                "focus-visible:border-none",
                "focus:ring-none border-none ring-0",
              )}
            >
              <SelectTrigger
                className={cn(
                  " border-input-none peer px-4 outline-none focus-visible:ring-0",
                  "focus:ring-0 focus-visible:border-none",
                  "focus:ring-none border-none ring-0",
                )}
              >
                <SelectValue placeholder=" " />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {/* {
                            query.data?.items?.map((item) => {
                                return <SelectItem key={item.id} value={item.value}>{item.title}</SelectItem>
                            })
                        } */}
            </SelectContent>
          </Select>

          <Label
            className={cn(
              "absolute left-[9px] top-px px-1 text-sm text-gray-500 transition-all duration-300 ",
              "pointer-events-none -translate-y-1/2 group-focus-within:!top-px group-focus-within:!text-sm group-focus-within:!text-blue-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-xl",
            )}
          >
            {label}
          </Label>

          <fieldset
            className={cn(
              "pointer-events-none invisible absolute inset-0 mt-[-9px] rounded border border-gray-400 group-focus-within:border-2  group-focus-within:!border-blue-500 group-hover:border-gray-700 peer-placeholder-shown:visible",
            )}
          >
            <legend className="invisible ml-2 max-w-[0.01px] whitespace-nowrap px-0 text-sm transition-all duration-300 group-focus-within:max-w-full group-focus-within:px-1">
              {label}
            </legend>
          </fieldset>

          <fieldset
            className={cn(
              "pointer-events-none absolute inset-0 rounded border border-gray-400 ",
              "visible mt-[-10px] group-focus-within:border-2 group-focus-within:!border-blue-500 group-hover:border-gray-700 peer-placeholder-shown:invisible",
            )}
          >
            <legend className="invisible ml-2 max-w-full whitespace-nowrap px-1 text-sm">
              {label}
            </legend>
          </fieldset>
        </div>
      </>
    );
  },
);
InputSelectField.displayName = "InputSelectField";
// export { InputSelectField };
