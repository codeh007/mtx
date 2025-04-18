"use client";

import { Button } from "../ui/button";

export interface ShowErrorProps {
  error?;
  reset: () => void;
  variants?: "default" | "card" | "toast";
}

export const ShowError = (props: ShowErrorProps) => {
  return (
    <div className="bg-orange-400 p-4 flex items-center justify-center flex-col">
      <h3>内部出错</h3>
      <Button type="button" onClick={() => props.reset()}>
        重试
      </Button>
    </div>
  );
};
