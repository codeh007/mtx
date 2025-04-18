import { ArrowsClockwise } from "@phosphor-icons/react";
import { cn } from "mtxuilib/lib/utils";
import type { ButtonProps } from "../button/Button";
import { Button } from "../button/Button";

export const RefreshButton = ({ ...props }: ButtonProps) => (
  <Button shape="square" toggled={props.toggled} {...props}>
    <ArrowsClockwise
      className={cn({
        "animate-refresh": props.toggled,
        "size-4.5": props.size === "base",
        "size-4": props.size === "sm",
        "size-5": props.size === "lg",
      })}
    />
  </Button>
);
