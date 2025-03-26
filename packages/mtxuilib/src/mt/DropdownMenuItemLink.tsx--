"use client";

import type { ComponentProps } from "react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { MtLink } from "./mtlink";

type DropdownMenuItemLinkProps = ComponentProps<typeof DropdownMenuItem>;

export const DropdownMenuItemLink = (
  props: {
    href: string;
  } & DropdownMenuItemLinkProps,
) => {
  const { href, ...etc } = props;

  return (
    <MtLink href={href}>
      <DropdownMenuItem {...etc} />
    </MtLink>
  );
};
