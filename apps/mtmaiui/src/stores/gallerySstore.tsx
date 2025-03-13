import { useSuspenseQuery } from "@tanstack/react-query";
import {
  type AgentConfig,
  type Gallery,
  type ModelConfig,
  type TeamConfig,
  type TerminationConfig,
  type ToolConfig,
  galleryGetOptions,
  galleryListOptions,
} from "mtmaiapi";
import { createContext, useContext, useMemo } from "react";
import { type StateCreator, createStore, useStore } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import { useTenantId } from "../hooks/useAuth";

export interface GalleryStoreProps {
  defaultGallery?: Gallery;
  galleries?: Gallery[];
}

interface GalleryState extends GalleryStoreProps {
  defaultGalleryId: string;
  selectedGalleryId: string | null;

  addGallery: (gallery: Gallery) => void;
  updateGallery: (id: string, gallery: Partial<Gallery>) => void;
  removeGallery: (id: string) => void;
  setDefaultGallery: (id: string) => void;
  selectGallery: (id: string) => void;
  getDefaultGallery: () => Gallery;
  getSelectedGallery: () => Gallery | null;
  syncGallery: (id: string) => Promise<void>;
  getLastSyncTime: (id: string) => string | null;
  getGalleryComponents: () => {
    teams: TeamConfig[];
    components: {
      agents: AgentConfig[];
      models: ModelConfig[];
      tools: ToolConfig[];
      terminations: TerminationConfig[];
    };
  };
}
export const createGallerySlice: StateCreator<
  GalleryState,
  [],
  [],
  GalleryState
> = (set, get, init) => {
  return {
    // export const useGalleryStore = create<GalleryStore>()(
    //   persist(
    //     (set, get) => ({
    galleries: [],
    defaultGalleryId: "system_default",
    selectedGalleryId: "system_default",

    addGallery: (gallery) =>
      set((state) => {
        if (
          (state.galleries || []).find(
            (g) => g.metadata?.id === gallery.metadata?.id,
          )
        )
          return state;
        return {
          galleries: [gallery, ...(state.galleries || [])],
          // defaultGalleryId: state.defaultGalleryId || gallery.id,
          selectedGalleryId: state.selectedGalleryId || gallery.metadata?.id,
        };
      }),

    updateGallery: (id, updates) =>
      set((state) => ({
        galleries: state.galleries?.map((gallery) =>
          gallery.metadata?.id === id
            ? {
                ...gallery,
                ...updates,
                metadata: {
                  ...gallery.metadata,
                  ...updates.metadata,
                  updated_at: new Date().toISOString(),
                },
              }
            : gallery,
        ),
      })),

    // removeGallery: (id) =>
    //   set((state) => {
    //     if (state.galleries.length <= 1) return state;

    //     const newGalleries = state.galleries.filter((g) => g.id !== id);
    //     const updates: Partial<GalleryStore> = {
    //       galleries: newGalleries,
    //     };

    //     // if (id === state.defaultGalleryId) {
    //     //   updates.defaultGalleryId = newGalleries[0].id;
    //     // }

    //     if (id === state.selectedGalleryId) {
    //       updates.selectedGalleryId = newGalleries[0].id;
    //     }

    //     return updates;
    //   }),

    // setDefaultGallery: (id) =>
    //   set((state) => {
    //     const gallery = state.galleries.find((g) => g.id === id);
    //     if (!gallery) return state;
    //     return { defaultGalleryId: id };
    //   }),

    selectGallery: (id) =>
      set((state) => {
        const gallery = state.galleries?.find((g) => g.id === id);
        if (!gallery) return state;
        return { selectedGalleryId: id };
      }),

    getDefaultGallery: () => {
      const { galleries, defaultGalleryId } = get();
      return galleries?.find((g) => g.metadata?.id === defaultGalleryId)!;
    },

    getSelectedGallery: () => {
      const { galleries, selectedGalleryId } = get();
      if (!selectedGalleryId) return null;
      return (
        galleries?.find((g) => g.metadata?.id === selectedGalleryId) || null
      );
    },

    syncGallery: async (id) => {
      const gallery = get().galleries?.find((g) => g.id === id);
      if (!gallery?.url) return;

      try {
        const response = await fetch(gallery.url);
        const remoteGallery = await response.json();

        // get().updateGallery(id, {
        //   ...remoteGallery,
        //   id, // preserve local id
        //   metadata: {
        //     ...remoteGallery.metadata,
        //     lastSynced: new Date().toISOString(),
        //   },
        // });
      } catch (error) {
        console.error("Failed to sync gallery:", error);
        throw error;
      }
    },

    getLastSyncTime: (id) => {
      const gallery = get().galleries?.find((g) => g.metadata?.id === id);
      return gallery?.lastSynced ?? null;
    },

    getGalleryComponents: () => {
      const defaultGallery = get().getDefaultGallery();
      return {
        teams: defaultGallery.items.teams,
        components: defaultGallery.items.components,
      };
    },
    ...init,
  };
};

type galleryStore = ReturnType<typeof createGalleryStore>;
export type GalleryStoreState = GalleryState;

const createGalleryStore = (initProps?: Partial<GalleryStoreState>) => {
  return createStore<GalleryStoreState>()(
    subscribeWithSelector(
      // persist(
      devtools(
        immer((...a) => ({
          ...createGallerySlice(...a),
          // ...createMessageParserSlice(...a),
          ...initProps,
        })),
        {
          name: "workbench-store",
        },
      ),
    ),
  );
};
const mtmaiStoreContext = createContext<galleryStore | null>(null);

type AppProviderProps = React.PropsWithChildren<GalleryStoreProps>;
export const GalleryProvider = (props: AppProviderProps) => {
  const { children, ...etc } = props;

  const tid = useTenantId();

  const gralleryGetQuery = useSuspenseQuery({
    ...galleryGetOptions({
      path: {
        tenant: tid,
        gallery: "default",
      },
    }),
  });

  etc.defaultGallery = gralleryGetQuery.data;

  const { data: galleriesData } = useSuspenseQuery({
    ...galleryListOptions({
      path: {
        tenant: tid,
      },
    }),
  });

  etc.galleries = galleriesData.rows;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const mystore = useMemo(() => createGalleryStore(etc), [etc]);
  return (
    <mtmaiStoreContext.Provider value={mystore}>
      {children}
    </mtmaiStoreContext.Provider>
  );
};

const DEFAULT_USE_SHALLOW = false;
export function useGalleryStore(): GalleryStoreState;
export function useGalleryStore<T>(
  selector: (state: GalleryStoreState) => T,
): T;
export function useGalleryStore<T>(selector?: (state: GalleryStoreState) => T) {
  const store = useContext(mtmaiStoreContext);
  if (!store) throw new Error("useGalleryStore must in GalleryProvider");
  if (selector) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useStore(
      store,
      DEFAULT_USE_SHALLOW ? useShallow(selector) : selector,
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useStore(store);
}
