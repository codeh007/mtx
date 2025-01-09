"use client";

import { useFormStatus } from "react-dom";
import { cn } from "../lib/utils";

import { LoaderI3con } from "../icons/LoaderI3con";
import { Button } from "../ui/button";

interface SubmitButtonProps {
  children: React.ReactNode;
  isSuccessful: boolean;
  className: string;
  pending?: boolean;
}
export function SubmitButton({
  children,
  isSuccessful,
  className,
  pending,
}: SubmitButtonProps) {
  const { pending: formPadding } = useFormStatus();

  const finnalPaddding = pending || formPadding;

  return (
    <Button
      type={finnalPaddding ? "button" : "submit"}
      aria-disabled={finnalPaddding || isSuccessful}
      disabled={finnalPaddding || isSuccessful}
      className={cn("relative", className)}
    >
      {children}

      {(finnalPaddding || isSuccessful) && (
        <span className="animate-spin absolute right-4">
          <LoaderI3con />
        </span>
      )}

      {/* biome-ignore lint/a11y/useSemanticElements: <explanation> */}
      <span aria-live="polite" className="sr-only" role="status">
        {pending || isSuccessful ? "Loading" : "Submit form"}
      </span>
    </Button>
  );
}
