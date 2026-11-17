import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface TestDriveRequest {
  id: string
  name: string
  phone: string
  carId: string
  date: string
  time: string
  createdAt: number
}

interface TestDriveState {
  isOpen: boolean
  presetCarId: string | null
  requests: TestDriveRequest[]
  open: (carId?: string) => void
  close: () => void
  submit: (req: Omit<TestDriveRequest, 'id' | 'createdAt'>) => Promise<void>
}

export const useTestDriveStore = create<TestDriveState>()(
  persist(
    (set) => ({
      isOpen: false,
      presetCarId: null,
      requests: [],
      open: (carId) => set({ isOpen: true, presetCarId: carId ?? null }),
      close: () => set({ isOpen: false }),
      submit: async (req) => {
        // TODO: replace with a real API call (CRM / Telegram bot / backend)
        await new Promise((r) => setTimeout(r, 900))
        set((s) => ({
          requests: [...s.requests, { ...req, id: crypto.randomUUID(), createdAt: Date.now() }],
        }))
      },
    }),
    { name: 'byd-test-drive', partialize: (s) => ({ requests: s.requests }) },
  ),
)
