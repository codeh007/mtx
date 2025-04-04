import { createLazyFileRoute } from "@tanstack/react-router";

import { ChevronRight } from "lucide-react";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { useEffect, useState } from "react";
// import { useGalleryStore } from "../../stores/gallerySstore";
import { GalleryCreateModal } from "../components/views/gallery/create-modal";
import type { Gallery } from "../components/views/gallery/types";
import { GallerySidebar } from "./sidebar";

export const Route = createLazyFileRoute("/gallery/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("gallerySidebar");
      return stored !== null ? JSON.parse(stored) : true;
    }
    return true;
  });

  // const {
  //   galleries,
  //   selectedGalleryId,
  //   selectGallery,
  //   addGallery,
  //   updateGallery,
  //   removeGallery,
  //   setDefaultGallery,
  //   getSelectedGallery,
  //   getDefaultGallery,
  // } = useGalleryStore();

  // const [messageApi, contextHolder] = message.useMessage();
  const currentGallery = getSelectedGallery();

  // Persist sidebar state
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gallerySidebar", JSON.stringify(isSidebarOpen));
    }
  }, [isSidebarOpen]);

  // Handle URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const galleryId = params.get("galleryId");

    if (galleryId && !selectedGalleryId) {
      handleSelectGallery(galleryId);
    }
  }, [selectedGalleryId]);

  // Update URL when gallery changes
  // useEffect(() => {
  //   if (selectedGalleryId) {
  //     window.history.pushState({}, "", `?galleryId=${selectedGalleryId}`);
  //   }
  // }, [selectedGalleryId]);

  const handleSelectGallery = async (galleryId: string) => {
    // if (hasUnsavedChanges) {
    //   Modal.confirm({
    //     title: "Unsaved Changes",
    //     content: "You have unsaved changes. Do you want to discard them?",
    //     okText: "Discard",
    //     cancelText: "Go Back",
    //     onOk: () => {
    //       selectGallery(galleryId);
    //       setHasUnsavedChanges(false);
    //     },
    //   });
    // } else {
    //   selectGallery(galleryId);
    // }
  };

  const handleCreateGallery = async (galleryData: Gallery) => {
    const newGallery: Gallery = {
      id: `gallery_${Date.now()}`,
      name: galleryData.name || "New Gallery",
      url: galleryData.url,
      metadata: {
        ...galleryData.metadata,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      items: galleryData.items || {
        teams: [],
        components: {
          agents: [],
          models: [],
          tools: [],
          terminations: [],
        },
      },
    };

    try {
      setIsLoading(true);
      await addGallery(newGallery);
      // messageApi.success("Gallery created successfully");
      selectGallery(newGallery.id);
    } catch (error) {
      // messageApi.error("Failed to create gallery");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGallery = async (galleryId: string) => {
    try {
      await removeGallery(galleryId);
      // messageApi.success("Gallery deleted successfully");
    } catch (error) {
      // messageApi.error("Failed to delete gallery");
      console.error(error);
    }
  };

  const handleUpdateGallery = async (
    galleryId: string,
    updates: Partial<Gallery>,
  ) => {
    try {
      await updateGallery(galleryId, updates);
      setHasUnsavedChanges(false);
      // messageApi.success("Gallery updated successfully");
    } catch (error) {
      // messageApi.error("Failed to update gallery");
      console.error(error);
    }
  };

  return (
    <>
      <main style={{ height: "100%" }} className=" h-full ">
        <div className="relative flex h-full w-full">
          {/* Create Modal */}
          <GalleryCreateModal
            open={isCreateModalOpen}
            onCancel={() => setIsCreateModalOpen(false)}
            onCreateGallery={handleCreateGallery}
          />

          {/* Sidebar */}
          <div
            className={`absolute left-0 top-0 h-full transition-all duration-200 ease-in-out ${
              isSidebarOpen ? "w-64" : "w-12"
            }`}
          >
            <GallerySidebar
              isOpen={isSidebarOpen}
              galleries={galleries}
              currentGallery={currentGallery}
              onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
              onSelectGallery={(gallery) => handleSelectGallery(gallery.id)}
              onCreateGallery={() => setIsCreateModalOpen(true)}
              onDeleteGallery={handleDeleteGallery}
              defaultGalleryId={getDefaultGallery()?.id}
              onSetDefault={setDefaultGallery}
              isLoading={isLoading}
            />
          </div>

          {/* Main Content */}
          <div
            className={`flex-1 transition-all max-w-5xl -mr-6 duration-200 ${
              isSidebarOpen ? "ml-64" : "ml-12"
            }`}
          >
            <div className="p-4 pt-2">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 mb-4 text-sm">
                <span className="text-primary font-medium">Galleries</span>
                {currentGallery && (
                  <>
                    <ChevronRight className="size-4  " />
                    <span className=" ">{currentGallery.name}</span>
                  </>
                )}
              </div>

              {/* Content Area */}
              {/* {currentGallery ? (
              <GalleryDetail
                gallery={currentGallery}
                onSave={(updates) =>
                  handleUpdateGallery(currentGallery.id, updates)
                }
                onDirtyStateChange={setHasUnsavedChanges}
              />
            ) : (
              <div className="flex items-center justify-center h-[calc(100vh-120px)]  ">
                Select a gallery from the sidebar or create a new one
              </div>
            )} */}
              <MtSuspenseBoundary>
                <div className="flex items-center justify-center h-[calc(100vh-120px)]">
                  Select a gallery from the sidebar or create a new one
                </div>
              </MtSuspenseBoundary>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
