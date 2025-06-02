"use client";

import { useEffect } from "react";

export default function MtmJsTest() {
  useEffect(() => {
    console.log("MtmJsTest");
  }, []);
  return <div>
    <h2 className="text-2xl font-bold bg-red-500">MtmJsTest</h2>


    <a href="https://www.bing.com" className="text-blue-500">Bing</a>
  </div>;
}

