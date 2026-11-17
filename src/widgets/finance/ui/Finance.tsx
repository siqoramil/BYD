import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { LoanCalculator } from '@/features/loan-calculator'
import { ModelSwitcher } from '@/features/select-car-model'
import { Container, SectionHeading } from '@/shared/ui'

export function Finance() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const blobA = useTransform(scrollYProgress, [0, 1], ['-20%', '40%'])
  const blobB = useTransform(scrollYProgress, [0, 1], ['30%', '-30%'])

  return (
    <section id="finance" ref={ref} className="relative overflow-hidden py-24 sm:py-32">
      <motion.div aria-hidden style={{ y: blobA }} className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-accent/15 blur-[120px]" />
      <motion.div aria-hidden style={{ y: blobB }} className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-sky-500/10 blur-[120px]" />
      <Container className="relative">
        <SectionHeading
          eyebrow="Финансирование"
          title="Кредитный калькулятор"
          description="Выберите модель и условия — ежемесячный платёж рассчитается сразу."
        />
        <div className="mt-10 mb-10">
          <ModelSwitcher />
        </div>
        <LoanCalculator />
      </Container>
    </section>
  )
}
