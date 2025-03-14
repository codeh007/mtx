"use client";
import { CalendarIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { add, format } from "date-fns";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../../ui/button";
import { Calendar } from "../../ui/calendar";
import { TimePicker } from "./time-picker";

type DateTimePickerProps = {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  label: string;
};

export function DateTimePicker({ date, setDate, label }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date);

  /**
   * carry over the current time when a user clicks a new day
   * instead of resetting to 00:00
   */
  const handleSelect = (newDay: Date | undefined) => {
    if (!newDay) {
      return;
    }
    if (!date) {
      setDate(newDay);
      return;
    }
    const diff = newDay.getTime() - date.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDateFull = add(date, { days: Math.ceil(diffInDays) });
    setDate(newDateFull);
  };

  return (
    <Popover
      onOpenChange={(isOpen) => {
        if (!isOpen && selectedDate !== date) {
          setDate(selectedDate);
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-fit justify-start text-left font-normal text-xs",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            `${label}:  ${format(date, "PPP HH:mm:ss")}`
          ) : (
            <span>{label}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => handleSelect(d)}
          initialFocus
        />
        <div className="p-3 border-t border-border">
          <TimePicker setDate={setSelectedDate} date={selectedDate} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
