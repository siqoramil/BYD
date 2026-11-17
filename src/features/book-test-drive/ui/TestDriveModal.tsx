import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Icon } from '@/shared/ui'
import { useTestDriveStore } from '../model/store'
import { TestDriveForm } from './TestDriveForm'

export function TestDriveModal() {
  const isOpen = useTestDriveStore((s) => s.isOpen)
  const close = useTestDriveStore((s) => s.close)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [isOpen, close])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={close} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="td-title"
            initial={{ opacity: 0, y: 40, rotateX: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            style={{ transformPerspective: 1200 }}
            className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-fg/10 bg-ink-900 p-6 sm:p-8"
          >
            <button
              onClick={close}
              aria-label="Закрыть"
              className="absolute top-4 right-4 grid h-10 w-10 cursor-pointer place-items-center rounded-full text-fg/60 hover:bg-fg/5 hover:text-fg"
            >
              <Icon.Close />
            </button>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Бесплатно · 30 минут</p>
            <h2 id="td-title" className="mt-2 mb-6 font-display text-2xl font-bold sm:text-3xl">
              Запись на тест‑драйв
            </h2>
            <TestDriveForm onDone={close} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
