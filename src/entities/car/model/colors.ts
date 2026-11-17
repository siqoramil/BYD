import type { CarColor } from './types'

/**
 * Paint colours. The id doubles as the studio shot file name:
 * `public/cars/<car id>/<colour id>.webp` (see `studioShot`).
 */
export const CAR_COLORS = {
  // Seal
  'polar-white': { id: 'polar-white', name: 'Polar White', hex: '#e9ebee' },
  'obsidian-black': { id: 'obsidian-black', name: 'Obsidian Black', hex: '#15171a' },
  'ruby-red': { id: 'ruby-red', name: 'Ruby Red', hex: '#c4122b' },
  'atlantis-grey': { id: 'atlantis-grey', name: 'Atlantis Grey', hex: '#7f93ad' },
  'indigo-grey': { id: 'indigo-grey', name: 'Indigo Grey', hex: '#9a9ca6' },
  'lavender-grey': { id: 'lavender-grey', name: 'Lavender Grey', hex: '#8f8a9c' },
  // Song Plus / Tang
  'ski-white': { id: 'ski-white', name: 'Ski White', hex: '#e6e8ea' },
  'cosmos-black': { id: 'cosmos-black', name: 'Cosmos Black', hex: '#111316' },
  'crimson-red': { id: 'crimson-red', name: 'Crimson Red', hex: '#a8202a' },
  'arctic-blue': { id: 'arctic-blue', name: 'Arctic Blue', hex: '#7fb0d6' },
  'mountain-grey': { id: 'mountain-grey', name: 'Mountain Grey', hex: '#4f5560' },
  'sand-beige': { id: 'sand-beige', name: 'Sand Beige', hex: '#a79f8c' },
  // Atto 2
  'boulder-grey': { id: 'boulder-grey', name: 'Boulder Grey', hex: '#6f7780' },
  'hiking-green': { id: 'hiking-green', name: 'Hiking Green', hex: '#8a9470' },
  // Chazor
  'time-grey': { id: 'time-grey', name: 'Time Grey', hex: '#8b9299' },
  // Seagull
  'apricity-white': { id: 'apricity-white', name: 'Apricity White', hex: '#e4dcc4' },
  'polar-night-black': { id: 'polar-night-black', name: 'Polar Night Black', hex: '#1b1d21' },
  'ice-blue': { id: 'ice-blue', name: 'Ice Blue', hex: '#9cc3e6' },
  'lemon-green': { id: 'lemon-green', name: 'Lemon Green', hex: '#c9dc3a' },
  // Han, Yangwang U9
  crimson: { id: 'crimson', name: 'Emperor Red', hex: '#9f111d' },
} satisfies Record<string, CarColor>

export type ColorId = keyof typeof CAR_COLORS

export const getColor = (id: string): CarColor => CAR_COLORS[id as ColorId] ?? CAR_COLORS['ski-white']

/** Official studio shot of a car in a given colour (same framing for every colour of a model). */
export const studioShot = (carId: string, colorId: string) => `/cars/${carId}/${colorId}.webp`
