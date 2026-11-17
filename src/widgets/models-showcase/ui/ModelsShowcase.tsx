import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { BODY_LABELS, CARS, CarCard, useCarStore, type BodyType } from '@/entities/car'
import { OpenTestDriveButton } from '@/features/book-test-drive'
import { FavoriteButton, useFavoritesStore } from '@/features/toggle-favorite'
import { useCar3DStore } from '@/features/view-car-3d'
import { cn, scrollToSection } from '@/shared/lib'
import { Button, Container, SectionHeading } from '@/shared/ui'

type Filter = 'all' | 'fav' | BodyType
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'sedan', label: BODY_LABELS.sedan },
  { id: 'suv', label: BODY_LABELS.suv },
  { id: 'hatch', label: BODY_LABELS.hatch },
  { id: 'coupe', label: BODY_LABELS.coupe },
  { id: 'fav', label: '♥ Избранное' },
]

export function ModelsShowcase() {
  const [filter, setFilter] = useState<Filter>('all')
  const favIds = useFavoritesStore((s) => s.ids)
  const setCar = useCarStore((s) => s.setCar)
  const view3d = useCar3DStore((s) => s.open)

  const cars = CARS.filter((c) =>
    filter === 'all' ? true : filter === 'fav' ? favIds.includes(c.id) : c.body === filter,
  )

  const configure = (id: string) => {
    setCar(id)
    scrollToSection('configurator')
  }

  return (
    <section id="models" className="relative py-24 sm:py-32">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Модельный ряд"
            title={
              <>
                Для каждой мечты — <span className="text-accent">свой BYD</span>
              </>
            }
            description="От городских хэтчбеков до суперкара — электромобили и подключаемые гибриды, каждую модель можно рассмотреть в 3D. Нажмите на машину, чтобы рассмотреть её ближе."
          />
          <div className="no-scrollbar -mx-4 flex shrink-0 gap-2 overflow-x-auto px-4 lg:mx-0 lg:max-w-md lg:flex-wrap lg:justify-end lg:px-0">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  'shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors',
                  filter === f.id ? 'border-fg bg-fg text-ink-950' : 'border-fg/15 text-fg/70 hover:border-fg/40',
                )}
              >
                {f.label}
                {f.id === 'fav' && favIds.length > 0 && ` (${favIds.length})`}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {cars.map((car, i) => (
              <motion.div
                key={car.id}
                layout
                initial={{ opacity: 0, y: 60, rotateX: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformPerspective: 1200 }}
              >
                <CarCard
                  car={car}
                  corner={<FavoriteButton carId={car.id} />}
                  onView={() => view3d(car.id)}
                  actions={
                    <>
                      <Button className="flex-1" variant="light" onClick={() => configure(car.id)}>
                        Настроить
                      </Button>
                      <OpenTestDriveButton className="flex-1" variant="outline" carId={car.id} />
                    </>
                  }
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {cars.length === 0 && (
          <p className="mt-14 rounded-3xl border border-dashed border-fg/15 py-16 text-center text-muted">
            Список избранного пуст — нажмите ♥ на понравившейся модели.
          </p>
        )}
      </Container>
    </section>
  )
}
