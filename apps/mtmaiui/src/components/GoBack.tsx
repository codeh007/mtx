"use client";

import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { BreadcrumbItem } from "mtxuilib/ui/breadcrumb";
import { buttonVariants } from "mtxuilib/ui/button";

interface GoBackProps {
  to: string;
  search?: Record<string, string>;
}
export const GoBack = ({ to, search }: GoBackProps) => {
  return (
    <BreadcrumbItem>
      <CustomLink
        to={to}
        search={search}
        className={cn(buttonVariants({ variant: "ghost" }))}
      >
        返回
      </CustomLink>
    </BreadcrumbItem>
  );
};
