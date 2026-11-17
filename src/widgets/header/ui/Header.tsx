import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { OpenTestDriveButton } from '@/features/book-test-drive'
import { useFavoritesStore } from '@/features/toggle-favorite'
import { ThemeToggle } from '@/features/toggle-theme'
import { NAV_LINKS } from '@/shared/config/site'
import { cn, scrollToSection } from '@/shared/lib'
import { Container, Icon, Logo } from '@/shared/ui'

export function Header() {
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menu, setMenu] = useState(false)
  const favCount = useFavoritesStore((s) => s.ids.length)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 40)
    setHidden(y > prev && y > 400 && !menu)
  })

  const go = (id: string) => {
    setMenu(false)
    scrollToSection(id)
  }

  return (
    <motion.header
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-40"
    >
      <div
        className={cn(
          'transition-[background,backdrop-filter,border-color] duration-500',
          scrolled || menu ? 'border-b border-fg/8 bg-ink-950/70 backdrop-blur-xl' : 'border-b border-transparent',
        )}
      >
        <Container className="flex h-16 items-center justify-between sm:h-20">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="cursor-pointer" aria-label="На главную">
            <Logo />
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="cursor-pointer rounded-full px-4 py-2 text-sm text-fg/70 transition-colors hover:text-fg"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => go('models')}
              className="relative grid h-10 w-10 cursor-pointer place-items-center rounded-full text-fg/70 hover:text-fg"
              aria-label={`Избранное: ${favCount}`}
            >
              <Icon.Heart width={18} height={18} />
              {favCount > 0 && (
                <span className="absolute top-1 right-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
                  {favCount}
                </span>
              )}
            </button>
            <ThemeToggle />
            <OpenTestDriveButton size="sm" className="hidden sm:inline-flex">
              Тест‑драйв
            </OpenTestDriveButton>
            <button
              onClick={() => setMenu((v) => !v)}
              className="grid h-10 w-10 cursor-pointer place-items-center rounded-full text-fg lg:hidden"
              aria-label="Меню"
              aria-expanded={menu}
            >
              {menu ? <Icon.Close /> : <Icon.Menu />}
            </button>
          </div>
        </Container>

        <AnimatePresence>
          {menu && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden lg:hidden"
            >
              <Container className="flex flex-col gap-1 pb-6">
                {NAV_LINKS.map((l, i) => (
                  <motion.button
                    key={l.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => go(l.id)}
                    className="cursor-pointer py-3 text-left font-display text-2xl"
                  >
                    {l.label}
                  </motion.button>
                ))}
                <OpenTestDriveButton className="mt-4 sm:hidden" onClickCapture={() => setMenu(false)}>
                  Записаться на тест‑драйв
                </OpenTestDriveButton>
              </Container>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
      <motion.div style={{ scaleX: progress }} className="h-[2px] origin-left bg-accent" />
    </motion.header>
  )
}
