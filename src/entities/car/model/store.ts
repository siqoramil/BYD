import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CARS, getCarById } from './cars'
import { getColor } from './colors'

interface CarConfigState {
  activeCarId: string
  colorId: string
  trimId: string
  setCar: (id: string) => void
  setColor: (id: string) => void
  setTrim: (id: string) => void
}

const first = CARS[0]!

export const useCarStore = create<CarConfigState>()(
  persist(
    (set) => ({
      activeCarId: first.id,
      colorId: first.colors[0],
      trimId: first.trims[0].id,
      setCar: (id) => {
        const car = getCarById(id)
        set({ activeCarId: car.id, colorId: car.colors[0], trimId: car.trims[0].id })
      },
      setColor: (colorId) => set({ colorId }),
      setTrim: (trimId) => set({ trimId }),
    }),
    {
      name: 'byd-configuration',
      version: 3,
      // older versions stored other colour ids — just start fresh
      migrate: () => ({}) as CarConfigState,
    },
  ),
)

export function useActiveCar() {
  return getCarById(useCarStore((s) => s.activeCarId))
}

/** Resolved configuration (car + colour + trim + total price). */
export function useConfiguration() {
  const car = useActiveCar()
  const colorId = useCarStore((s) => s.colorId)
  const trimId = useCarStore((s) => s.trimId)
  const color = getColor(car.colors.includes(colorId) ? colorId : car.colors[0])
  const trim = car.trims.find((t) => t.id === trimId) ?? car.trims[0]
  return { car, color, trim, total: car.price + trim.priceDelta }
}
