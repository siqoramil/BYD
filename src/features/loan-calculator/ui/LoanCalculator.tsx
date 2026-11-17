import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { useConfiguration } from '@/entities/car'
import { formatUsd } from '@/shared/lib'
import { LOAN_ANNUAL_RATE } from '@/shared/config/site'
import { useLoanStore } from '../model/store'
import { monthlyPayment } from '../lib/annuity'

const TERMS = [12, 24, 36, 48, 60]

export function LoanCalculator() {
  const { car, trim, total } = useConfiguration()
  const { downPct, months, setDownPct, setMonths } = useLoanStore()

  const down = (total * downPct) / 100
  const monthly = monthlyPayment(total - down, LOAN_ANNUAL_RATE, months)

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div className="grid gap-8">
        <div>
          <div className="mb-3 flex justify-between text-sm">
            <span className="text-muted">Первоначальный взнос</span>
            <span className="font-medium">
              {downPct}% · {formatUsd(down)}
            </span>
          </div>
          <input
            type="range"
            min={20}
            max={80}
            step={5}
            value={downPct}
            onChange={(e) => setDownPct(Number(e.target.value))}
            className="range"
            style={{ ['--p' as string]: `${((downPct - 20) / 60) * 100}%` }}
            aria-label="Процент первоначального взноса"
          />
        </div>
        <div>
          <p className="mb-3 text-sm text-muted">Срок</p>
          <div className="grid grid-cols-5 gap-2">
            {TERMS.map((t) => (
              <button
                key={t}
                onClick={() => setMonths(t)}
                aria-pressed={t === months}
                className={
                  'cursor-pointer rounded-xl border py-3 text-sm transition-colors ' +
                  (t === months ? 'border-fg bg-fg text-ink-950' : 'border-fg/12 text-fg/70 hover:border-fg/40')
                }
              >
                {t} мес
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs leading-relaxed text-muted">
          Расчёт приблизительный: по ставке {Math.round(LOAN_ANNUAL_RATE * 100)}% годовых. Точные условия зависят от банка
          и выбранной программы.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-fg/10 bg-gradient-to-br from-fg/8 to-transparent p-6 sm:p-8">
        <div aria-hidden className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-accent/30 blur-3xl" />
        <p className="relative text-sm text-muted">
          BYD {car.name} · {trim.name}
        </p>
        <p className="relative mt-1 text-sm text-muted">Цена: {formatUsd(total)}</p>
        <p className="relative mt-8 text-xs uppercase tracking-[0.25em] text-fg/60">Ежемесячный платёж</p>
        <AnimatedUsd value={monthly} className="relative mt-2 block font-display text-5xl font-bold sm:text-6xl" />
        <p className="relative mt-2 text-sm text-muted">в течение {months} мес</p>
      </div>
    </div>
  )
}

function AnimatedUsd({ value, className }: { value: number; className?: string }) {
  const mv = useMotionValue(value)
  const text = useTransform(mv, (v) => formatUsd(v))
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.6, ease: 'easeOut' })
    return () => c.stop()
  }, [mv, value])
  return <motion.span className={className}>{text}</motion.span>
}
