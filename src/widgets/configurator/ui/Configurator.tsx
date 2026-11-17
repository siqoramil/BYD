import { AnimatePresence, motion } from 'motion/react'
import { getCarModel, PaintedCarImage, PhotoCredit, studioShot, useConfiguration } from '@/entities/car'
import { OpenTestDriveButton } from '@/features/book-test-drive'
import { ColorPicker } from '@/features/select-car-color'
import { ModelSwitcher } from '@/features/select-car-model'
import { TrimSelector } from '@/features/select-trim'
import { useCar3DStore } from '@/features/view-car-3d'
import { formatUsd, scrollToSection } from '@/shared/lib'
import { Button, Container, Icon, SectionHeading } from '@/shared/ui'

export function Configurator() {
  const { car, color, trim, total } = useConfiguration()
  const view3d = useCar3DStore((s) => s.open)
  const has3d = Boolean(getCarModel(car.id))

  return (
    <section id="configurator" className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Конфигуратор"
          title="Соберите свой BYD"
          description="Выберите модель, цвет и комплектацию — цена пересчитается сразу."
        />

        <div className="mt-10">
          <ModelSwitcher />
        </div>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Photo stage — same 16:9 shape as the studio shots, so the whole car is always visible
              and the image is never upscaled by cropping (no preserve-3d, it breaks overflow clipping) */}
          <div
            className={
              'relative isolate aspect-[16/9] overflow-hidden rounded-3xl border border-fg/8 [clip-path:inset(0_round_1.5rem)] lg:sticky lg:top-24 ' +
              (car.studio ? 'bg-white' : 'bg-ink-900')
            }
          >
            {car.studio ? (
              // official studio shot per colour — same framing, so only the paint changes
              <AnimatePresence initial={false}>
                <motion.img
                  key={`${car.id}/${color.id}`}
                  src={studioShot(car.id, color.id)}
                  alt={`BYD ${car.name}, ${color.name}`}
                  draggable={false}
                  decoding="async"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="absolute inset-0 h-full w-full object-cover select-none"
                />
              </AnimatePresence>
            ) : (
              <>
                <div className="absolute inset-0">
                  <PaintedCarImage photo={car.photo} alt={`BYD ${car.name}, ${color.name}`} />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </>
            )}

            {has3d && (
              <Button size="sm" className="absolute top-4 right-4" onClick={() => view3d(car.id, color.id)}>
                <Icon.Cube width={16} height={16} />
                Смотреть в 3D
              </Button>
            )}

            <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-end justify-between gap-3 sm:inset-x-5 sm:bottom-5">
              <span className="inline-flex items-center gap-2 rounded-full bg-black/75 px-3 py-1.5 text-xs text-white backdrop-blur">
                <span className="h-2.5 w-2.5 rounded-full ring-1 ring-fg/40" style={{ background: color.hex }} />
                {color.name}
              </span>
              {car.studio ? (
                <a href="https://www.byd.com" target="_blank" rel="noreferrer" className="text-[10px] text-black/45 hover:text-black">
                  Фото: byd.com
                </a>
              ) : (
                <PhotoCredit photo={car.photo} className="text-white/60" />
              )}
            </div>
          </div>

          <aside className="flex flex-col gap-7 rounded-3xl border border-fg/8 bg-ink-900 p-6 sm:p-8">
            <div>
              <AnimatePresence mode="wait">
                <motion.div key={car.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h3 className="font-display text-3xl font-bold">BYD {car.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{car.description}</p>
                </motion.div>
              </AnimatePresence>
              <dl className="mt-5 grid grid-cols-4 gap-2 text-center">
                {[
                  [trim.rangeKm, 'км'],
                  [trim.accel, 'с'],
                  [trim.powerHp, 'л.с.'],
                  [car.batteryKwh, 'кВт·ч'],
                ].map(([v, u]) => (
                  <div key={u} className="rounded-xl bg-fg/4 py-3">
                    <dd className="font-display text-base font-semibold">{v}</dd>
                    <dt className="text-[11px] text-muted">{u}</dt>
                  </div>
                ))}
              </dl>
            </div>
            <ColorPicker />
            <TrimSelector />
            <div className="mt-auto border-t border-fg/8 pt-6">
              <div className="flex items-end justify-between">
                <span className="text-sm text-muted">Итоговая цена</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={total}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="font-display text-3xl font-bold"
                  >
                    {formatUsd(total)}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <OpenTestDriveButton carId={car.id}>Тест‑драйв</OpenTestDriveButton>
                <Button variant="outline" onClick={() => scrollToSection('finance')}>
                  Кредит
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  )
}
