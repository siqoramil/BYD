import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  CarImage,
  getCarById,
  getCarModel,
  getColor,
  LICENSE_URLS,
  PhotoCredit,
  studioShot,
  type Car,
} from '@/entities/car'
import { cn } from '@/shared/lib'
import { BydLoader, Icon } from '@/shared/ui'
import { useCar3DStore } from '../model/store'

const CarViewer3D = lazy(() => import('./CarViewer3D'))

interface Car3DModalProps {
  /** slot for action buttons (test-drive, configure …) — receives the viewed car */
  renderActions?: (car: Car, close: () => void) => ReactNode
}

export function Car3DModal({ renderActions }: Car3DModalProps) {
  const carId = useCar3DStore((s) => s.carId)
  const initialColorId = useCar3DStore((s) => s.colorId)
  const close = useCar3DStore((s) => s.close)
  const isOpen = carId !== null

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
      {carId !== null && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={close} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="car3d-title"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="relative flex h-[min(88svh,780px)] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-fg/10 bg-ink-900"
          >
            <Viewer key={carId} car={getCarById(carId)} initialColorId={initialColorId} close={close} renderActions={renderActions} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Viewer({
  car,
  initialColorId,
  close,
  renderActions,
}: {
  car: Car
  initialColorId: string | null
  close: () => void
  renderActions?: Car3DModalProps['renderActions']
}) {
  const [colorId, setColorId] = useState(initialColorId && car.colors.includes(initialColorId) ? initialColorId : car.colors[0])
  const color = getColor(colorId)
  const model = getCarModel(car.id)

  return (
    <>
      <header className="flex items-start justify-between gap-4 p-5 pb-3 sm:p-7 sm:pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">{model ? '3D‑просмотр' : 'Просмотр'}</p>
          <h2 id="car3d-title" className="mt-1 font-display text-2xl font-bold sm:text-3xl">
            BYD {car.name}
          </h2>
        </div>
        <button
          onClick={close}
          aria-label="Закрыть"
          className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full text-fg/60 hover:bg-fg/5 hover:text-fg"
        >
          <Icon.Close />
        </button>
      </header>

      {/* stage */}
      <div
        className="relative mx-3 min-h-0 flex-1 overflow-hidden rounded-2xl sm:mx-5"
        style={{
          background:
            'radial-gradient(ellipse 75% 60% at 50% 62%, color-mix(in srgb, var(--color-fg) 20%, var(--color-ink-900)), var(--color-ink-950) 78%)',
        }}
      >
        {model ? (
          <>
            <Suspense
              fallback={
                <div className="absolute inset-0 grid place-items-center">
                  <BydLoader label="Загружаем 3D‑модель" />
                </div>
              }
            >
              <CarViewer3D model={model} colorHex={color.hex} />
            </Suspense>
            <p className="pointer-events-none absolute inset-x-0 top-4 flex items-center justify-center gap-2 text-xs text-muted">
              <Icon.Rotate width={14} height={14} />
              Тяните, чтобы вращать · колёсико или щипок — масштаб
            </p>
            <p className="absolute right-4 bottom-3 text-[10px] text-fg/45">
              3D‑модель:{' '}
              <a href={model.source} target="_blank" rel="noreferrer" className="underline-offset-2 hover:text-fg hover:underline">
                {model.author}
              </a>
              ,{' '}
              <a href={LICENSE_URLS[model.license]} target="_blank" rel="noreferrer" className="underline-offset-2 hover:text-fg hover:underline">
                {model.license}
              </a>
            </p>
          </>
        ) : (
          <>
            {car.studio ? (
              <img
                key={color.id}
                src={studioShot(car.id, color.id)}
                alt={`BYD ${car.name}, ${color.name}`}
                draggable={false}
                className="absolute inset-0 h-full w-full bg-white object-contain select-none"
              />
            ) : (
              <>
                <CarImage photo={car.photo} alt={`BYD ${car.name}`} sizes="100vw" className="absolute inset-0" />
                <PhotoCredit photo={car.photo} className="absolute right-4 bottom-3 rounded bg-black/55 px-2 py-0.5 text-white/75" />
              </>
            )}
            <p className="absolute top-4 left-4 inline-flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-full bg-black/75 px-3 py-1.5 text-xs text-white backdrop-blur">
              <Icon.Cube width={14} height={14} className="shrink-0" />
              3D‑модель этой машины ещё не добавлена — пока показываем фото
            </p>
          </>
        )}
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-4 p-5 pt-4 sm:p-7 sm:pt-5">
        <fieldset className="flex items-center gap-4">
          <legend className="sr-only">Цвет кузова</legend>
          <div className="flex flex-wrap gap-2.5">
            {car.colors.map((id) => {
              const c = getColor(id)
              const active = id === color.id
              return (
                <button
                  key={id}
                  onClick={() => setColorId(id)}
                  aria-label={c.name}
                  aria-pressed={active}
                  title={c.name}
                  className={cn(
                    'h-8 w-8 cursor-pointer rounded-full ring-offset-[3px] ring-offset-ink-900 transition-transform duration-300 hover:scale-110',
                    active ? 'ring-2 ring-fg' : 'ring-1 ring-fg/20',
                  )}
                  style={{ background: `radial-gradient(circle at 30% 25%, rgb(255 255 255 / 0.65), ${c.hex} 45%, ${c.hex})` }}
                />
              )
            })}
          </div>
          <span className="text-sm text-muted">{color.name}</span>
        </fieldset>
        {renderActions && <div className="flex gap-2">{renderActions(car, close)}</div>}
      </footer>
    </>
  )
}
