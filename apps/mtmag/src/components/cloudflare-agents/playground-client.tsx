"use client";
// import "./playground-client.css";
import Chat from "./playground/Chat";
// import RPC from "./playground/RPC";
// import Chat from "./playground/Chat";
// import Email from "./playground/Email";
// import RPC from "./playground/RPC";
// import { Scheduler } from "./playground/Scheduler";

export function PlaygroundApp() {
  return (
    <div className="container">
      {/* <div className="toasts-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div> */}

      <div className="flex gap-2">
        {/* <div className="col-span-1">
          <h2 className="text-xl font-bold mb-4">Scheduler</h2>
          <Scheduler addToast={addToast} />
        </div> */}
        {/* <div className="col-span-1">
          <h2 className="text-xl font-bold mb-4">State Sync Demo</h2>
          <Stateful addToast={addToast} />
        </div> */}
        {/* <div className="col-span-1">
          <h2 className="text-xl font-bold mb-4">Email (wip)</h2>
          <Email addToast={addToast} />
        </div> */}
        <div className="flex-1 w-full">
          <Chat />
        </div>
        {/* <div className="col-span-1">
          <h2 className="text-xl font-bold mb-4">RPC Demo</h2>
          <RPC addToast={addToast} />
        </div> */}
      </div>
    </div>
  );
}
