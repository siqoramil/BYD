import { useState, type FormEvent, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CARS, useCarStore } from '@/entities/car'
import { Button, Icon } from '@/shared/ui'
import { cn } from '@/shared/lib'
import { useTestDriveStore } from '../model/store'
import { formatUzPhone, isValidUzPhone } from '../lib/phone'

const TIMES = ['10:00', '12:00', '14:00', '16:00', '18:00']
const today = () => new Date().toISOString().slice(0, 10)

export function TestDriveForm({ onDone }: { onDone?: () => void }) {
  const presetCarId = useTestDriveStore((s) => s.presetCarId)
  const activeCarId = useCarStore((s) => s.activeCarId)
  const submit = useTestDriveStore((s) => s.submit)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('+998')
  const [carId, setCarId] = useState(presetCarId ?? activeCarId)
  const [date, setDate] = useState(today())
  const [time, setTime] = useState(TIMES[1]!)
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [touched, setTouched] = useState(false)

  const nameOk = name.trim().length >= 2
  const phoneOk = isValidUzPhone(phone)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!nameOk || !phoneOk) return
    setStatus('sending')
    await submit({ name: name.trim(), phone, carId, date, time })
    setStatus('done')
  }

  return (
    <AnimatePresence mode="wait">
      {status === 'done' ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center py-10 text-center"
        >
          <span className="grid h-16 w-16 place-items-center rounded-full bg-accent text-white">
            <Icon.Check width={30} height={30} />
          </span>
          <h3 className="mt-6 font-display text-2xl font-bold">Заявка принята!</h3>
          <p className="mt-2 max-w-sm text-muted">
            Наш менеджер скоро перезвонит на номер <span className="text-fg">{phone}</span>.
          </p>
          {onDone && (
            <Button variant="outline" className="mt-8" onClick={onDone}>
              Закрыть
            </Button>
          )}
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={onSubmit} noValidate exit={{ opacity: 0 }} className="grid gap-4 sm:grid-cols-2">
          <Field label="Ваше имя" error={touched && !nameOk ? 'Введите имя' : undefined}>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя Фамилия" autoComplete="name" />
          </Field>
          <Field label="Телефон" error={touched && !phoneOk ? 'Введите номер полностью' : undefined}>
            <input
              className="input"
              value={phone}
              inputMode="tel"
              autoComplete="tel"
              onChange={(e) => setPhone(formatUzPhone(e.target.value))}
            />
          </Field>
          <Field label="Модель" className="sm:col-span-2">
            <select className="input" value={carId} onChange={(e) => setCarId(e.target.value)}>
              {CARS.map((c) => (
                <option key={c.id} value={c.id}>
                  BYD {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Дата">
            <input className="input" type="date" min={today()} value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Время">
            <div className="flex flex-wrap gap-1.5">
              {TIMES.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTime(t)}
                  className={cn(
                    'cursor-pointer rounded-full border px-3 py-2 text-xs transition-colors',
                    t === time ? 'border-fg bg-fg text-ink-950' : 'border-fg/15 text-fg/70 hover:border-fg/40',
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </Field>
          <Button type="submit" size="lg" className="mt-2 sm:col-span-2" disabled={status === 'sending'} icon={<Icon.ArrowRight />}>
            {status === 'sending' ? 'Отправляем…' : 'Записаться на тест‑драйв'}
          </Button>
          <p className="text-xs text-muted sm:col-span-2">
            Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  )
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string
  error?: string
  className?: string
  children: ReactNode
}) {
  return (
    <label className={cn('grid gap-2 text-sm', className)}>
      <span className="text-muted">{label}</span>
      {children}
      {error && <span className="text-xs text-accent">{error}</span>}
    </label>
  )
}
