import { createLazyFileRoute } from "@tanstack/react-router";
import { Terminal } from "lucide-react";
import { cn } from "mtxuilib/lib/utils";
import { MtTabsContent } from "mtxuilib/mt/tabs";

export const Route = createLazyFileRoute("/coms/$comId/team_builder/")({
  component: RouteComponent,
});

function RouteComponent() {
  // const form = useFormContext();
  return (
    <>
      <MtTabsContent value="team">
        <div className="h-full overflow-hidden bg-slate-100 border border-slate-300">
          <Terminal
            // key={index}
            className={cn("h-full overflow-hidden", {
              // hidden: !isActive,
            })}
            ref={(ref) => {
              // terminalRefs.current.push(ref);
            }}
            // onTerminalReady={(terminal) => {
            //   console.log("onTerminalReady", terminal);
            //   // workbenchStore.attachTerminal(terminal)
            //   // terminalRef.current = ref;
            //   attachTerminal(terminal);
            // }}
            // onTerminalResize={(cols, rows) => {
            //   // workbenchStore.onTerminalResize(cols, rows);
            // }}
            // theme={theme}
          />
        </div>
      </MtTabsContent>
      <MtTabsContent value="agent">
        {/* {listItem?.length > 0 ? (
            <div className="flex flex-col overflow-y-auto max-h-[600px] whitespace-pre-wrap break-all font-mono text-sm leading-5 bg-black text-gray-200 p-2">
              {listItem?.map((item, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <div key={i} className="min-w-0">
                  {item}
                </div>
              ))}
            </div>
          ) : null} */}
      </MtTabsContent>

      {/* <FormField
        control={form.control}
        name="label"
        render={({ field }) => (
          <FormItem>
            <FormLabel>label</FormLabel>
            <FormControl>
              <Input placeholder="label" {...field} />
            </FormControl>
            <FormDescription>label</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="provider"
        render={({ field }) => (
          <FormItem>
            <FormLabel>provider</FormLabel>
            <FormControl>
              <Input placeholder="provider" {...field} />
            </FormControl>
            <FormDescription>provider</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      /> */}
    </>
  );
}
