import { useRef, type ComponentType, type SVGProps } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Container, Icon, Reveal, SectionHeading, TiltCard } from '@/shared/ui'

const FEATURES: { icon: ComponentType<SVGProps<SVGSVGElement>>; title: string; text: string }[] = [
  { icon: Icon.Battery, title: 'Blade Battery', text: 'LFP‑батарея в форме пластин: безопасная, компактная и долговечная.' },
  { icon: Icon.Chip, title: 'e-Platform 3.0', text: 'Силовой агрегат «8 в 1» и умный тепловой насос повышают эффективность.' },
  { icon: Icon.Bolt, title: 'Быстрая зарядка', text: 'Быстрая зарядка постоянным током: с 30% до 80% примерно за 30 минут.' },
  { icon: Icon.Plug, title: 'Функция V2L', text: 'Автомобиль — мобильный источник питания: подключайте бытовую технику на природе.' },
  { icon: Icon.Shield, title: 'DiPilot', text: 'Адаптивный круиз, удержание в полосе и камера 360° — для спокойных поездок.' },
  { icon: Icon.Gauge, title: 'Гарантия', text: 'Длительная официальная гарантия на батарею и силовой агрегат.' },
]

export function TechFeatures() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // three columns drifting at different speeds = parallax grid
  const offsets = [
    useTransform(scrollYProgress, [0, 1], [80, -80]),
    useTransform(scrollYProgress, [0, 1], [160, -160]),
    useTransform(scrollYProgress, [0, 1], [40, -40]),
  ]

  return (
    <section ref={ref} className="relative overflow-hidden py-24 sm:py-36">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Технологии"
          title="Инженерия для будущего"
          description="BYD сама производит батареи, моторы и электронику — поэтому каждая деталь идеально подходит к другой."
        />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[0, 1, 2].map((col) => (
            <motion.div key={col} style={{ y: offsets[col] }} className="grid gap-6 md:max-lg:!transform-none">
              {FEATURES.filter((_, i) => i % 3 === col).map((f, i) => (
                <Reveal key={f.title} delay={col * 0.1 + i * 0.1}>
                  <TiltCard className="p-7">
                    <div style={{ transform: 'translateZ(50px)' }}>
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/12 text-accent">
                        <f.icon width={24} height={24} />
                      </span>
                      <h3 className="mt-6 font-display text-xl font-bold">{f.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
