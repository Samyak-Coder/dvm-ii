import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useStore = create((set) => ({
  selected: null,
  setSelected: (item) => set({ selected: item }),
  clearSelected: () => set({ selected: null }),
}));

export const useLike = create(
  persist(
    (set, get) => ({
      likedStory: [],

      addLikedStory: (story) => {
        const exists = get().likedStory.some(
          (s) => s.key === story.key
        );
        if (exists) return;

        set((state) => ({likedStory: [...state.likedStory, story],}));
      },

      dislikeStory: (likedId) =>set((state) => ({likedStory: state.likedStory.filter((liked) => liked.key !== likedId)}))

    }),
    {
      name: 'liked-story-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useSearchCache = create(
  persist(
    (set, get) => ({
      searchCache: [],

      addSearchCache: (searched) => {
        const exists = get().searchCache.some(
          (s) => s.key === searched.key
        );

        if (exists) return;

        set((state) => ({
          searchCache: [...state.searchCache, searched],
        }));
      },

      rmSearchCache: (searchId) =>set((state) => ({searchCache: state.searchCache.filter((item) => item.key != searchId),})),
    }),
    {
      name: 'search-cache-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
