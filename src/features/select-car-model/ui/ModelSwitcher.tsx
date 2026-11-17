import { useId } from 'react'
import { motion } from 'motion/react'
import { CARS, useCarStore } from '@/entities/car'
import { cn } from '@/shared/lib'

export function ModelSwitcher() {
  const activeId = useCarStore((s) => s.activeCarId)
  const setCar = useCarStore((s) => s.setCar)
  const pillId = useId() // unique per instance, so two switchers on the page don't steal each other's pill

  return (
    <div role="tablist" aria-label="Выбор модели" className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">
      {CARS.map((car) => {
        const active = car.id === activeId
        return (
          <button
            key={car.id}
            role="tab"
            aria-selected={active}
            onClick={() => setCar(car.id)}
            className={cn(
              'relative shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm transition-colors',
              active ? 'text-ink-950' : 'text-fg/60 hover:text-fg',
            )}
          >
            {active && (
              <motion.span
                layoutId={pillId}
                className="absolute inset-0 rounded-full bg-fg"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{car.name}</span>
          </button>
        )
      })}
    </div>
  )
}
