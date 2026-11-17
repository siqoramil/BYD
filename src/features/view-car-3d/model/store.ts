import { create } from 'zustand'

interface Car3DState {
  carId: string | null
  /** colour to start with (e.g. the one chosen in the configurator) */
  colorId: string | null
  open: (carId: string, colorId?: string) => void
  close: () => void
}

export const useCar3DStore = create<Car3DState>()((set) => ({
  carId: null,
  colorId: null,
  open: (carId, colorId) => set({ carId, colorId: colorId ?? null }),
  close: () => set({ carId: null }),
}))
