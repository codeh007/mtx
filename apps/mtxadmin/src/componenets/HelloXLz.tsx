"use client";

import { Button } from "mtxuilib/ui/button";
import dynamic from "next/dynamic";
import { useState } from "react";

const LzHelloX = dynamic(() => import("./HelloX").then((x) => x.HelloX), {
  ssr: false,
  loading: () => <div>Loading HelloX</div>,
});
export const HelloXLz = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="text-red-500 p-2 bg-lime-600 fixed top-10 right-4 size-10">
      {open && <LzHelloX />}
      <Button
        onClick={() => {
          setOpen(!open);
        }}
      >
        open
      </Button>
    </div>
  );
};
