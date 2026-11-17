import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { PaintedCarImage, useConfiguration } from '@/entities/car'
import { TestDriveForm } from '@/features/book-test-drive'
import { Container, Reveal } from '@/shared/ui'

export function TestDriveSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  const { car } = useConfiguration()

  return (
    <section id="test-drive" ref={ref} className="relative overflow-hidden py-24 sm:py-32">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-fg/10 bg-gradient-to-br from-ink-850 to-ink-950 p-6 sm:p-12">
          <motion.div aria-hidden style={{ y: photoY }} className="pointer-events-none absolute -inset-y-[15%] inset-x-0">
            <PaintedCarImage photo={car.photo} alt="" className="opacity-30" />
          </motion.div>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/60" />
          <div className="relative grid gap-10 lg:grid-cols-2">
            <Reveal>
              <p className="mb-4 text-xs uppercase tracking-[0.3em] text-accent">Бесплатный тест‑драйв</p>
              <h2 className="font-display text-3xl leading-[1.05] font-bold sm:text-5xl">
                Прокатитесь один раз — <br />
                <span className="text-fg/50">и почувствуйте разницу.</span>
              </h2>
              <ul className="mt-8 grid gap-3 text-sm text-fg/70">
                <li>• 30‑минутный маршрут по городу и трассе</li>
                <li>• В сопровождении личного консультанта</li>
                <li>• Консультация по trade‑in и кредиту</li>
              </ul>
            </Reveal>
            <Reveal delay={0.15}>
              <TestDriveForm />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
