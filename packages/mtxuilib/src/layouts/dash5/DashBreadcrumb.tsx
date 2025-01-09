"use client";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../ui/breadcrumb";
export const DashBreadcrumb = (props: {
  listClasses?: string;
  classActivate?: string;
  capitalizeLinks?: boolean;
  homeElement?: ReactNode;
}) => {
  const { listClasses, classActivate, capitalizeLinks } = props;
  const paths = usePathname();
  const selectedLayoutSegments = useSelectedLayoutSegments();
  //中间的
  const middleItems = selectedLayoutSegments.slice(
    0,
    selectedLayoutSegments.length - 1,
  );
  //最后一个
  const pageItem = selectedLayoutSegments.slice(-1);

  return (
    <>
      <Breadcrumb
        className={cn(
          "hidden md:flex",
          //附加样式
          // "items-center justify-center bg-blue-100 bg-gradient-to-r from-purple-600 to-blue-600 py-2",
        )}
      >
        <BreadcrumbList className="font-bold">
          {/* home节点 */}
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              {/* <Link href={`${DASH_PATH}`}>dash</Link> */}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          {/* 中间节点 */}
          {/* {middleItems.map((link, index) => {
						const href = `${DASH_PATH}/${selectedLayoutSegments.slice(0, index + 1).join("/")}`;
						const itemClasses =
							paths === href ? `${listClasses} ${classActivate}` : listClasses;
						const itemLink = capitalizeLinks
							? link[0].toUpperCase() + link.slice(1, link.length)
							: link;
						return (
							<Fragment key={link}>
								<BreadcrumbItem className={itemClasses}>
									<BreadcrumbLink asChild>
										<Link href={href}>{itemLink}</Link>
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
							</Fragment>
						);
					})} */}
          {/* 最后 */}
          <BreadcrumbItem>
            <BreadcrumbPage>{pageItem}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};
