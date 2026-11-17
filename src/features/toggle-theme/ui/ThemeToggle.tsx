import { AnimatePresence, motion } from 'motion/react'
import { Icon } from '@/shared/ui'
import { cn } from '@/shared/lib'
import { useThemeStore } from '../model/store'

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useThemeStore((s) => s.theme)
  const toggle = useThemeStore((s) => s.toggle)
  const label = theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'

  return (
    <button
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        'grid h-10 w-10 cursor-pointer place-items-center overflow-hidden rounded-full text-fg/70 transition-colors hover:bg-fg/5 hover:text-fg',
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 14, opacity: 0, rotate: -40 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -14, opacity: 0, rotate: 40 }}
          transition={{ duration: 0.2 }}
          className="grid place-items-center"
        >
          {theme === 'dark' ? <Icon.Sun width={18} height={18} /> : <Icon.Moon width={18} height={18} />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
