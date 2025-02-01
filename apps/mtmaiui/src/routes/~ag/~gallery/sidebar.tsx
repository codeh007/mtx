import {
  Globe,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Pin,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import type { Gallery } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "mtxuilib/ui/tooltip";
import type React from "react";
import { getRelativeTimeString } from "../../components/views/atoms";
import { useGalleryStore } from "./store";

interface GallerySidebarProps {
  isOpen: boolean;
  galleries: Gallery[];
  currentGallery: Gallery | null;
  onToggle: () => void;
  onSelectGallery: (gallery: Gallery) => void;
  onCreateGallery: () => void;
  onDeleteGallery: (galleryId: string) => void;
  onSetDefault: (galleryId: string) => void;
  isLoading?: boolean;
  defaultGalleryId: string;
}

export const GallerySidebar: React.FC<GallerySidebarProps> = ({
  isOpen,
  galleries,
  currentGallery,
  onToggle,
  onSelectGallery,
  onCreateGallery,
  onDeleteGallery,
  onSetDefault,
  defaultGalleryId,
  isLoading = false,
}) => {
  const { syncGallery, getLastSyncTime } = useGalleryStore();

  // Render collapsed state
  if (!isOpen) {
    return (
      <div className="h-full border-r border-secondary">
        <div className="p-2 -ml-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                onClick={onToggle}
                className="p-2 rounded-md hover:bg-secondary hover:text-accent text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50"
              >
                <PanelLeftOpen strokeWidth={1.5} className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Open Sidebar</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="mt-4 px-2 -ml-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="w-full p-2 flex justify-center"
                onClick={onCreateGallery}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create new gallery</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    );
  }

  // Render expanded state
  return (
    <div className="h-full border-r border-secondary">
      {/* Header */}
      <div className="flex items-center justify-between pt-0 p-4 pl-2 pr-2 border-b border-secondary">
        <div className="flex items-center gap-2">
          <span className="text-primary font-medium">Galleries</span>
          <span className="px-2 py-0.5 text-xs bg-accent/10 text-accent rounded">
            {galleries.length}
          </span>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onToggle}
              className="p-2 rounded-md hover:bg-secondary hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50"
            >
              <PanelLeftClose strokeWidth={1.5} className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Close Sidebar</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Create Gallery Button */}
      <div className="my-4 flex text-sm">
        <div className="mr-2 w-full">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="w-full" onClick={onCreateGallery}>
                <Plus className="w-4 h-4" />
                New Gallery
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create new gallery</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Section Label */}
      <div className="py-2 text-sm text-secondary">All Galleries</div>

      {/* Galleries List */}
      {isLoading ? (
        <div className="p-4 text-center text-secondary text-sm">Loading...</div>
      ) : galleries.length === 0 ? (
        <div className="p-4 text-center text-secondary text-sm">
          No galleries found
        </div>
      ) : (
        <div className="scroll overflow-y-auto h-[calc(100%-170px)]">
          {galleries.map((gallery) => (
            <div
              key={gallery.metadata.id}
              className="relative border-secondary"
            >
              <div
                className={`absolute top-1 left-0.5 z-50 h-[calc(100%-8px)] w-1 bg-opacity-80 rounded ${
                  currentGallery?.metadata.id === gallery.metadata.id
                    ? "bg-accent"
                    : "bg-tertiary"
                }`}
              />
              {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
              <div
                className={`group ml-1 flex flex-col p-3 rounded-l cursor-pointer hover:bg-secondary ${
                  currentGallery?.metadata.id === gallery.metadata.id
                    ? "border-accent bg-secondary"
                    : "border-transparent"
                }`}
                onClick={() => onSelectGallery(gallery)}
              >
                {/* Gallery Name and Actions Row */}
                <div className="flex items-center justify-between min-w-0">
                  {" "}
                  {/* Added min-w-0 */}
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {" "}
                    {/* Added min-w-0 and flex-1 */}
                    <div className="truncate flex-1">
                      {" "}
                      {/* Wrapped name in div with truncate and flex-1 */}
                      <span className="font-medium">{gallery.name}</span>
                    </div>
                    {gallery.url && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Globe className="w-3 h-3 text-secondary flex-shrink-0" />{" "}
                          {/* Added flex-shrink-0 */}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remote Gallery</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0">
                    {gallery.url && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            className="p-0 min-w-[24px] h-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              syncGallery(gallery.metadata.id);
                            }}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Sync gallery</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant={"ghost"}
                          className={`p-0 min-w-[24px] h-6 ${
                            defaultGalleryId === gallery.metadata.id
                              ? "text-accent"
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSetDefault(gallery.metadata.id);
                          }}
                        >
                          <Pin
                            className={`w-4 h-4 ${
                              defaultGalleryId === gallery.metadata.id
                                ? "fill-accent"
                                : ""
                            }`}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {gallery.metadata.id
                          ? "Default gallery"
                          : "Set as default gallery"}
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          className="p-0 min-w-[24px] h-6"
                          variant={"destructive"}
                          disabled={galleries.length === 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteGallery(gallery.metadata.id);
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {galleries.length === 1
                          ? "Cannot delete the last gallery"
                          : "Delete gallery"}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {/* Rest of the content remains the same */}
                <div className="mt-1 flex items-center gap-2 text-xs text-secondary">
                  <span className="bg-secondary/20 truncate rounded px-1">
                    {gallery?.meta?.version}
                  </span>
                  <div className="flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    <span>
                      {Object.values(gallery.items.components).reduce(
                        (sum, arr) => sum + arr.length,
                        0,
                      )}{" "}
                      components
                    </span>
                  </div>
                </div>

                {/* Updated Timestamp */}
                <div className="mt-1 flex items-center gap-1 text-xs text-secondary">
                  <span>
                    {getRelativeTimeString(gallery.metadata.updatedAt)}
                    {defaultGalleryId === gallery.metadata.id ? (
                      <span className="text-accent border-accent border rounded px-1 ml-1 py-0.5">
                        default
                      </span>
                    ) : (
                      ""
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div className="p-2 mt-2 border-dashed border rounded text-xs mr-2">
            Gallery items marked as default (
            <Pin className="w-4 h-4 inline-block -mt-0.5" />) are available in
            the builder by default.
          </div>
        </div>
      )}
    </div>
  );
};
