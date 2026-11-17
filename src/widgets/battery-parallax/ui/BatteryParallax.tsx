import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { Container } from '@/shared/ui'

const BLADES = 14
const FACTS = [
  { k: '01', title: 'Тест на прокол', text: 'При проколе гвоздём Blade Battery не загорается и не дымит.' },
  { k: '02', title: 'Химия LFP', text: 'Литий‑железо‑фосфат — стабильная химия и долгий срок службы.' },
  { k: '03', title: 'Cell-to-Body', text: 'Батарея — часть кузова: высокая жёсткость и больше места в салоне.' },
]

function Blade({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const start = (i / BLADES) * 0.35
  const z = useTransform(progress, [start, start + 0.35], [0, 40 + (i % 2) * 20])
  const x = useTransform(progress, [0.1, 0.6], [0, (i - BLADES / 2) * 9])
  const glow = useTransform(progress, [start + 0.1, start + 0.4], [0.15, 1])
  return (
    <motion.div
      style={{ translateZ: z, x, left: `${(i / BLADES) * 100}%` }}
      className="absolute top-0 h-full w-[5.2%]"
    >
      <motion.div
        style={{ opacity: glow }}
        className="h-full w-full rounded-[3px] border border-fg/25 bg-gradient-to-b from-zinc-300 via-zinc-500 to-zinc-700 shadow-[0_0_30px_-5px_var(--color-accent)]"
      />
    </motion.div>
  )
}

function Fact({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const a = 0.12 + i * 0.28
  const last = i === FACTS.length - 1
  const opacity = useTransform(progress, [a - 0.08, a, a + 0.14, a + 0.2], [i === 0 ? 1 : 0, 1, 1, last ? 1 : 0])
  const y = useTransform(progress, [a - 0.08, a, a + 0.14, a + 0.2], [i === 0 ? 0 : 40, 0, 0, last ? 0 : -40])
  const f = FACTS[i]!
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0">
      <p className="font-display text-7xl font-extrabold text-accent/90 sm:text-8xl">{f.k}</p>
      <h3 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{f.title}</h3>
      <p className="mt-4 max-w-sm text-lg leading-relaxed text-muted">{f.text}</p>
    </motion.div>
  )
}

export function BatteryParallax() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const rotateX = useTransform(scrollYProgress, [0, 1], [62, 48])
  const rotateZ = useTransform(scrollYProgress, [0, 1], [-38, -24])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.08])
  const bigY = useTransform(scrollYProgress, [0, 1], ['20%', '-30%'])
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="battery" ref={ref} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <motion.p
          aria-hidden
          style={{ y: bigY }}
          className="text-outline-faint pointer-events-none absolute -right-10 font-display text-[22vw] leading-none font-extrabold whitespace-nowrap select-none"
        >
          BLADE
        </motion.p>

        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent">
              <span className="h-px w-8 bg-accent" />
              Blade Battery
            </p>
            <h2 className="font-display text-3xl leading-[1.05] font-bold sm:text-5xl">
              Безопасность — <br />
              в самом сердце.
            </h2>
            <div className="relative mt-10 h-64">
              {FACTS.map((_, i) => (
                <Fact key={i} i={i} progress={scrollYProgress} />
              ))}
            </div>
            <div className="mt-6 h-px w-full max-w-sm bg-fg/10">
              <motion.div style={{ width: bar }} className="h-full bg-accent" />
            </div>
          </div>

          <div className="relative h-[42vh] sm:h-[55vh]" style={{ perspective: 1400 }}>
            <motion.div
              style={{ rotateX, rotateZ, scale, transformStyle: 'preserve-3d' }}
              className="absolute inset-[10%]"
            >
              <div
                className="absolute inset-[-6%] rounded-2xl border border-fg/10 bg-ink-850/80"
                style={{ transform: 'translateZ(-2px)' }}
              />
              <div className="relative h-full w-full" style={{ transformStyle: 'preserve-3d' }}>
                {Array.from({ length: BLADES }, (_, i) => (
                  <Blade key={i} i={i} progress={scrollYProgress} />
                ))}
              </div>
            </motion.div>
          </div>
        </Container>
      </div>
    </section>
  )
}
