"use client";

import type React from "react";

// 实现方式2：
import { type PropsWithChildren, memo } from "react";
import { cn } from "../lib/utils";
import { Button } from "../ui/button";

type IconSize = "sm" | "md" | "lg" | "xl" | "xxl";

interface BaseIconButtonProps {
  size?: IconSize;
  className?: string;
  iconClassName?: string;
  disabledClassName?: string;
  title?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

type IconButtonWithoutChildrenProps = {
  icon: string;
  children?: undefined;
} & BaseIconButtonProps;

type IconButtonWithChildrenProps = {
  icon?: undefined;
  children: React.ReactNode[];
} & BaseIconButtonProps;

type IconButtonProps =
  | IconButtonWithoutChildrenProps
  | IconButtonWithChildrenProps;

/**
 * 图标图标按钮，未完全实现，但这个代码看起来不错。
 * 其中，如果使用unocss，那么可以直接使用 icon class的方式来实现
 */
export const IconButton = memo(
  ({
    icon,
    size = "xl",
    className,
    iconClassName,
    disabledClassName,
    disabled = false,
    title,
    onClick,
    children,
  }: IconButtonProps) => {
    return (
      <button
        type="button"
        className={cn(
          "flex items-center text-bolt-elements-item-contentDefault bg-transparent enabled:hover:text-bolt-elements-item-contentActive rounded-md p-1 enabled:hover:bg-bolt-elements-item-backgroundActive disabled:cursor-not-allowed",
          {
            [cn("opacity-30", disabledClassName)]: disabled,
          },
          className,
        )}
        title={title}
        disabled={disabled}
        onClick={(event) => {
          if (disabled) {
            return;
          }

          onClick?.(event);
        }}
      >
        {children ? (
          children
        ) : (
          <div className={cn(icon, getIconSize(size), iconClassName)} />
        )}
      </button>
    );
  },
);

function getIconSize(size: IconSize) {
  if (size === "sm") {
    return "text-sm";
  }
  if (size === "md") {
    return "text-md";
  }
  if (size === "lg") {
    return "text-lg";
  }
  if (size === "xl") {
    return "text-xl";
  }
  return "text-2xl";
}

export const MtIconButton = memo(({ children }: PropsWithChildren) => {
  return <Button>{children}</Button>;
});
