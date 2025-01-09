"use client";

import { cn } from "../../lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../ui/resizable";

const defaultLayout = [20, 32, 48];
export const DashLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen h-full">
      {/* <MainHeader /> */}
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
            sizes,
          )}`;
        }}
        className="h-full items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          // collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => {
            // setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true,
            )}`;
          }}
          onResize={() => {
            // setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false,
            )}`;
          }}
          className={cn(
            // isCollapsed &&
            // 	"min-w-[50px] transition-all duration-300 ease-in-out",
          )}
        >
          <div className="flex flex-1 flex-col md:flex-row">
            <aside className="hidden md:block md:w-64  p-4 md:h-[calc(100vh-3.5rem)]">
              <nav>
                {/* asider-start */}
                <div className="flex flex-col gap-1 overflow-y-auto">
                  {/* <AsiderView /> */}
                </div>
              </nav>
            </aside>

            {/* <div className="h-full w-full p-4"></div> */}
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <main className="flex-1 overflow-auto bg-card m-2 rounded-md">
            <div className="h-full w-full">{children}</div>
          </main>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
          todo content
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
