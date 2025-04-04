import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
// import { GalleryProvider } from "../../stores/gallerySstore";
import { RootAppWrapper } from "../components/RootAppWrapper";
import type { Gallery } from "../components/views/gallery/types";

export const Route = createLazyFileRoute("/gallery")({
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
  // const currentGallery = getSelectedGallery();

  // Persist sidebar state
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gallerySidebar", JSON.stringify(isSidebarOpen));
    }
  }, [isSidebarOpen]);

  // Handle URL params
  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const galleryId = params.get("galleryId");

  //   if (galleryId && !selectedGalleryId) {
  //     handleSelectGallery(galleryId);
  //   }
  // }, [selectedGalleryId]);

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

    // try {
    //   setIsLoading(true);
    //   await addGallery(newGallery);
    //   // messageApi.success("Gallery created successfully");
    //   selectGallery(newGallery.id);
    // } catch (error) {
    //   // messageApi.error("Failed to create gallery");
    //   console.error(error);
    // } finally {
    //   setIsLoading(false);
    // }
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
    <RootAppWrapper
    // secondSidebar={<NavComs />}
    >
      {/* <GalleryProvider> */}
      <Outlet />
      {/* </GalleryProvider> */}
    </RootAppWrapper>
  );
}
