import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CARS } from '@/entities/car'

interface FavoritesState {
  ids: string[]
  toggle: (id: string) => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) => set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id] })),
    }),
    {
      name: 'byd-favorites',
      // drop saved favourites of cars that are no longer in the catalogue
      merge: (saved, current) => ({
        ...current,
        ids: ((saved as Partial<FavoritesState> | undefined)?.ids ?? []).filter((id) => CARS.some((c) => c.id === id)),
      }),
    },
  ),
)
