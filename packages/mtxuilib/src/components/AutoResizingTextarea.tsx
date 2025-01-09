"use client";
import { type ChangeEventHandler, useLayoutEffect, useRef } from "react";
import { cn } from "../lib/utils";
import { Textarea } from "../ui/textarea";

type Props = {
  value: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  className?: string;
  readOnly?: boolean;
  placeholder?: string;
};

export function AutoResizingTextarea({
  value,
  onChange,
  className,
  readOnly,
  placeholder,
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    // size the textarea correctly on first render
    if (!ref.current) {
      return;
    }
    ref.current.style.height = `${ref.current.scrollHeight + 2}px`;
  }, []);

  function setSize() {
    if (!ref.current) {
      return;
    }
    ref.current.style.height = "auto";
    ref.current.style.height = `${ref.current.scrollHeight + 2}px`;
  }

  return (
    <Textarea
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      placeholder={placeholder}
      ref={ref}
      onKeyDown={setSize}
      onInput={setSize}
      rows={1}
      className={cn("min-h-0 resize-none overflow-y-hidden", className)}
    />
  );
}
