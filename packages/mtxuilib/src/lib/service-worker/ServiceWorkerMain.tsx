"use client";

import { useEffect } from "react";
import { Button } from "../../ui";
export const ServiceWorkerMain = () => {
  // const workerRef = useRef<Worker>();

  // useEffect(() => {
  //   if (typeof window != 'undefined') {
  //     console.log("worker 导入地址：", new URL("./worker.ts", import.meta.url))
  //     workerRef.current = new Worker(new URL("./worker.ts", import.meta.url));
  //     workerRef.current.onmessage = (event: MessageEvent<number>) =>
  //       alert(`WebWorker Response => ${event.data}`);
  //   }
  //   return () => {
  //     workerRef.current?.terminate();
  //   };
  // }, []);

  // const handleWork = useCallback(async () => {
  //   workerRef.current?.postMessage(100000);
  // }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register(new URL("./sw.ts", import.meta.url), { scope: "./" })
          .then((registration) => {
            console.log(
              "Service worker registered successfully2. Scope:",
              registration.scope,
            );
          })
          .catch((error) => {
            console.error("Service worker registration failed3:", error);
          });
      }
    }
  }, []);

  return (
    <div className="prose bg-slate-100">
      <p>WebWorker7</p>
      {/* <button onClick={handleWork}>Calculate PI</button> */}

      <Button
        onClick={() => {
          console.log("fetch1");
          fetch("/");
        }}
      >
        fetch-test
      </Button>
    </div>
  );
};
