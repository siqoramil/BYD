import { motion } from 'motion/react'
import { Icon } from '@/shared/ui'
import { cn } from '@/shared/lib'
import { useFavoritesStore } from '../model/store'

export function FavoriteButton({ carId }: { carId: string }) {
  const active = useFavoritesStore((s) => s.ids.includes(carId))
  const toggle = useFavoritesStore((s) => s.toggle)
  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={() => toggle(carId)}
      aria-pressed={active}
      aria-label={active ? 'Убрать из избранного' : 'Добавить в избранное'}
      className={cn(
        'grid h-9 w-9 cursor-pointer place-items-center rounded-full border backdrop-blur transition-colors',
        active ? 'border-accent bg-accent text-white' : 'border-white/20 bg-black/35 text-white/80 hover:text-white',
      )}
    >
      <Icon.Heart filled={active} width={16} height={16} />
    </motion.button>
  )
}
