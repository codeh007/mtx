"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface JsonObjectInputProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: any;
  onChange?: (value: any) => void;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * 不依赖大型组件,实现简单的 JSON 编辑器
 * TODO: 渐进加载的方式加载大型JSON可视化编辑器,例如: @monaco-editor/react
 */
export const JsonObjectInput = React.forwardRef<
  HTMLDivElement,
  JsonObjectInputProps
>(({ className, value, onChange, disabled, placeholder, ...props }, ref) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const formatJson = (val: any): string => {
    try {
      return JSON.stringify(val, null, 2);
    } catch (e) {
      return "";
    }
  };

  const parseJson = (val: string): any => {
    try {
      return JSON.parse(val);
    } catch (e) {
      return undefined;
    }
  };

  const handleChange = (newValue: string) => {
    onChange?.(newValue);
  };

  const handleBlur = () => {
    const parsed = parseJson(value);
    if (parsed !== undefined) {
      onChange?.(parsed);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative rounded-md border border-input bg-background",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
      {...props}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          className={cn(
            "w-full min-h-[200px] font-mono text-sm p-3 rounded-md",
            "bg-background",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            disabled && "cursor-not-allowed",
          )}
          value={typeof value === "string" ? value : formatJson(value)}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
        />
      ) : (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <div
          className={cn(
            "w-full min-h-[200px] font-mono text-sm p-3 rounded-md",
            "cursor-pointer whitespace-pre overflow-auto",
            !value && "text-muted-foreground",
          )}
          onClick={() => {
            if (!disabled) {
              setIsEditing(true);
              setTimeout(() => {
                textareaRef.current?.focus();
              }, 0);
            }
          }}
        >
          {value ? formatJson(value) : placeholder}
        </div>
      )}
    </div>
  );
});

JsonObjectInput.displayName = "JsonObjectInput";
