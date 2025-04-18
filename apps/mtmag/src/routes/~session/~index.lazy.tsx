import { createLazyFileRoute } from "@tanstack/react-router";
import Chat from "../../components/cloudflare-agents/playground/Chat";
export const Route = createLazyFileRoute("/session/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      {/* <ChatClient /> */}
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
    </>
  );
}
