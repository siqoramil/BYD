import { create } from 'zustand'

export type Theme = 'dark' | 'light'

/** Same key is read by the inline script in index.html (applies the theme before first paint). */
const STORAGE_KEY = 'byd-theme'

function readTheme(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

function applyTheme(theme: Theme) {
  if (theme === 'light') document.documentElement.dataset.theme = 'light'
  else delete document.documentElement.dataset.theme
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // private mode — the theme just won't be remembered
  }
}

interface ThemeState {
  theme: Theme
  toggle: () => void
}

export const useThemeStore = create<ThemeState>()((set, get) => ({
  theme: readTheme(),
  toggle: () => {
    const theme: Theme = get().theme === 'dark' ? 'light' : 'dark'
    applyTheme(theme)
    set({ theme })
  },
}))
