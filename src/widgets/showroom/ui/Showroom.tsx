import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { SHOWROOM } from '@/shared/config/site'
import { Container, Icon, Reveal } from '@/shared/ui'

const WORDS = ['ЭЛЕКТРО', '•', 'БУДУЩЕЕ', '•', 'BYD', '•', 'ТАШКЕНТ', '•']

export function Showroom() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rowA = useTransform(scrollYProgress, [0, 1], ['0%', '-35%'])
  const rowB = useTransform(scrollYProgress, [0, 1], ['-35%', '0%'])
  const cardY = useTransform(scrollYProgress, [0, 1], [80, -80])

  const line = [...WORDS, ...WORDS, ...WORDS].join('  ')

  return (
    <section id="showroom" ref={ref} className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none select-none">
        <motion.p style={{ x: rowA }} className="font-display text-[14vw] leading-none font-extrabold whitespace-nowrap text-fg/[0.04]">
          {line}
        </motion.p>
        <motion.p style={{ x: rowB }} className="text-outline-faint font-display text-[14vw] leading-none font-extrabold whitespace-nowrap">
          {line}
        </motion.p>
      </div>

      <Container className="relative -mt-[10vw]">
        <motion.div style={{ y: cardY }} className="grid gap-6 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <div className="h-full rounded-3xl border border-fg/10 bg-ink-900/80 p-8 backdrop-blur-xl sm:p-10">
              <p className="text-xs uppercase tracking-[0.3em] text-accent">Автосалон</p>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Приезжайте к нам</h2>
              <p className="mt-4 max-w-lg text-muted">
                Все модели — в выставочном зале. Кофе, консультация и тест‑драйв — в одном месте.
              </p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <Info icon={<Icon.Pin />} label="Адрес">
                  <a href={SHOWROOM.mapUrl} target="_blank" rel="noreferrer" className="hover:text-accent">
                    {SHOWROOM.address}
                  </a>
                </Info>
                <Info icon={<Icon.Phone />} label="Телефон">
                  <a href={SHOWROOM.phoneHref} className="hover:text-accent">
                    {SHOWROOM.phone}
                  </a>
                </Info>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-3xl bg-accent p-8 text-white sm:p-10">
              <Icon.Clock width={28} height={28} />
              <h3 className="mt-6 font-display text-2xl font-bold">Часы работы</h3>
              <dl className="mt-6 grid gap-4">
                {SHOWROOM.hours.map((h) => (
                  <div key={h.days} className="flex justify-between border-b border-white/25 pb-3">
                    <dt className="text-white/80">{h.days}</dt>
                    <dd className="font-medium">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </motion.div>
      </Container>
    </section>
  )
}

function Info({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-fg/10 text-accent">{icon}</span>
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="mt-1">{children}</p>
      </div>
    </div>
  )
}
