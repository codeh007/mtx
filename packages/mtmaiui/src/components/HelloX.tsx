"use client";

import { Button } from "mtxuilib/ui/button";

export const HelloX = () => {
  return (
    <div className="text-red-500">
      HelloX
      <Button
        onClick={async () => {
          const meta = import.meta.url
          console.log("meta.path",import.meta.path)
          console.log("meta.url",import.meta.url)
          const tools = await import("./external-app/tools");
          console.log("click1", tools.fn1());
        }}
      >
        click1
      </Button>
    </div>
  );
};
