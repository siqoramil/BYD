import { useRef } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { PaintedCarImage, PhotoCredit, useConfiguration } from '@/entities/car'
import { OpenTestDriveButton } from '@/features/book-test-drive'
import { scrollToSection, useDepth, useMousePosition } from '@/shared/lib'
import { Button, Container, Icon } from '@/shared/ui'

const STATS = [
  { value: '3.8', unit: 'с', label: '0–100 км/ч' },
  { value: '610', unit: 'км', label: 'На одной зарядке' },
  { value: '150', unit: 'кВт', label: 'Быстрая зарядка' },
]

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const { car, color } = useConfiguration()
  const mouse = useMousePosition()

  // scroll parallax — every layer moves at its own speed
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.3])
  const shade = useTransform(scrollYProgress, [0, 0.8], [0, 0.75])
  const wordY = useTransform(scrollYProgress, [0, 1], ['0%', '-45%'])
  const titleY = useTransform(scrollYProgress, [0, 0.6], ['0%', '-60%'])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0])
  const statsY = useTransform(scrollYProgress, [0, 1], ['0%', '-140%'])

  // pointer parallax + 3D tilt
  const photoX = useDepth(mouse.x, -30)
  const photoMY = useDepth(mouse.y, -18)
  const tiltY = useDepth(mouse.x, 4)
  const tiltX = useDepth(mouse.y, -3)
  const wordX = useDepth(mouse.x, 60)
  const fgX = useDepth(mouse.x, 18)
  const fgY = useDepth(mouse.y, 12)

  return (
    <section ref={ref} className="relative h-[190vh]" aria-label="BYD">
      <div className="sticky top-0 h-svh overflow-hidden" style={{ perspective: 1400 }}>
        {/* layer 0 — real photo */}
        <motion.div style={{ y: photoY, scale: photoScale }} className="absolute inset-0">
          <motion.div style={{ x: photoX, y: photoMY, rotateY: tiltY, rotateX: tiltX }} className="absolute -inset-[4%]">
            <AnimatePresence initial={false}>
              <motion.div
                key={car.id}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <PaintedCarImage photo={car.photo} alt={`BYD ${car.name}, ${color.name}`} priority />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* legibility gradients */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/35 to-transparent" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-950/80 to-transparent" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-950 via-ink-950/60 to-transparent" />
        <motion.div aria-hidden style={{ opacity: shade }} className="absolute inset-0 bg-ink-950" />

        {/* layer 1 — giant outlined wordmark floating over the photo */}
        <motion.div aria-hidden style={{ y: wordY }} className="pointer-events-none absolute inset-0 flex items-end justify-end">
          <motion.span
            style={{ x: wordX }}
            className="mr-[-2vw] mb-[18vh] font-display text-[26vw] leading-none font-extrabold tracking-tighter text-transparent mix-blend-overlay select-none [-webkit-text-stroke:1.5px_rgb(255_255_255/0.5)]"
          >
            BYD
          </motion.span>
        </motion.div>

        {/* layer 2 — headline */}
        <motion.div style={{ y: titleY, opacity: titleOpacity }} className="pointer-events-none absolute inset-x-0 top-24 sm:top-32">
          <Container>
            <motion.div style={{ x: fgX, y: fgY }}>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="mb-4 text-xs uppercase tracking-[0.4em] text-fg/70"
              >
                BYD {car.name} · Ташкент
              </motion.p>
              <h1 className="font-display text-[13vw] leading-[0.9] font-extrabold tracking-tight drop-shadow-2xl sm:text-[8.5vw] lg:text-[7.5rem]">
                {['Build', 'Your', 'Dreams'].map((w, i) => (
                  <motion.span
                    key={w}
                    initial={{ opacity: 0, y: '100%', rotateX: -70 }}
                    animate={{ opacity: 1, y: '0%', rotateX: 0 }}
                    transition={{ delay: 0.3 + i * 0.12, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformPerspective: 800 }}
                    className={'inline-block pr-[0.25em] ' + (i === 2 ? 'text-accent' : '')}
                  >
                    {w}
                  </motion.span>
                ))}
              </h1>
            </motion.div>
          </Container>
        </motion.div>

        {/* layer 3 — CTA + stats */}
        <motion.div style={{ y: statsY }} className="absolute inset-x-0 bottom-8 sm:bottom-12">
          <Container className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="max-w-md"
            >
              <p className="text-sm leading-relaxed text-fg/80 sm:text-base">
                Электромобили нового поколения: безопасность Blade Battery, запас хода 600+ км и удобные условия
                кредита — всё в одном салоне.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <OpenTestDriveButton size="lg" icon={<Icon.ArrowRight />}>
                  Тест‑драйв
                </OpenTestDriveButton>
                <Button size="lg" variant="outline" className="backdrop-blur" onClick={() => scrollToSection('models')}>
                  Модели
                </Button>
              </div>
            </motion.div>

            <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-fg/10 bg-fg/10 backdrop-blur-md">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  className="bg-ink-950/60 px-4 py-4 sm:px-7 sm:py-5"
                >
                  <dd className="font-display text-2xl font-bold sm:text-3xl">
                    {s.value}
                    <span className="ml-1 text-sm font-normal text-fg/50">{s.unit}</span>
                  </dd>
                  <dt className="mt-1 text-[11px] text-fg/50 sm:text-xs">{s.label}</dt>
                </motion.div>
              ))}
            </dl>
          </Container>
        </motion.div>

        <PhotoCredit photo={car.photo} className="absolute right-4 bottom-2" />
      </div>
    </section>
  )
}
