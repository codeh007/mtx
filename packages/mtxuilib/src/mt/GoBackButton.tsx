"use client";

import { ChevronLeft } from "lucide-react";
import { useCanGoBack } from "../hooks/use-can-back";
import { useMtRouter } from "../hooks/use-router";
import { Button } from "../ui/button";

interface GoBackButtonProps {
  href?: string;
}
export const GoBackButton = ({ href }: GoBackButtonProps) => {
  const canGoBack = useCanGoBack();
  const router = useMtRouter();
  // const goBackTo = useMemo(() => {
  //   if (href) return href;
  //   return window.history.length > 1 ? window.history.back() : "/";
  // }, [href]);

  const handleClick = () => {
    // if (href) return router.push(href);
    if (href) {
      router.push(href);
    } else {
      window.history.back();
    }
  };
  return (
    <>
      {canGoBack && (
        <Button
          className="text-sm"
          onClick={handleClick}
          size="icon"
          variant={"ghost"}
        >
          <>
            <ChevronLeft className="mr-2 size-5" />
            {/* 返回 */}
          </>
        </Button>
      )}
    </>
  );
};
