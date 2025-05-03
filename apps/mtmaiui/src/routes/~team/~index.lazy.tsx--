import { createLazyFileRoute } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";

export const Route = createLazyFileRoute("/team/")({
  component: RouteComponent,
});

function RouteComponent() {
  const isSidebarOpen = false;
  return (
    <main style={{ height: "100%" }} className=" h-full ">
      <div className="relative flex h-full w-full">
        {/* Sidebar */}
        <div
          className={`absolute left-0 top-0 h-full transition-all duration-200 ease-in-out ${
            isSidebarOpen ? "w-64" : "w-12"
          }`}
        >
          {/* <TeamSidebar
            isOpen={isSidebarOpen}
            teams={teamQuery.data?.rows ?? []}
            currentTeam={currentTeam}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            // onSelectTeam={handleSelectTeam}
            onCreateTeam={handleCreateTeam}
            onEditTeam={setCurrentTeam}
            onDeleteTeam={handleDeleteTeam}
            isLoading={isLoading}
          /> */}
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 transition-all -mr-6 duration-200 ${
            isSidebarOpen ? "ml-64" : "ml-12"
          }`}
        >
          <div className="p-4 pt-2">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-4 text-sm">
              <span className="text-primary font-medium"> Teams</span>
              {/* {currentTeam && (
                <>
                  <ChevronRight className="size-4  " />
                  <span className=" ">
                    {currentTeam.component?.config?.name}
                    {currentTeam.metadata?.id ? (
                      ""
                    ) : (
                      <span className="text-xs text-orange-500">(New)</span>
                    )}
                  </span>
                </>
              )} */}
            </div>

            {/* Content Area */}
            <MtSuspenseBoundary>
              {/* <Outlet /> */}
              <div className="flex items-center   justify-center h-[calc(100vh-190px)]">
                Select a team from the sidebar or create a new one
              </div>
            </MtSuspenseBoundary>
          </div>
        </div>
      </div>
    </main>
  );
}
