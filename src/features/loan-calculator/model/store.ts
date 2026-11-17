import { create } from 'zustand'

interface LoanState {
  downPct: number
  months: number
  setDownPct: (v: number) => void
  setMonths: (v: number) => void
}

export const useLoanStore = create<LoanState>()((set) => ({
  downPct: 30,
  months: 36,
  setDownPct: (downPct) => set({ downPct }),
  setMonths: (months) => set({ months }),
}))
