import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cn, parseISODate, toISODate } from '@/shared/lib'
import { Calendar, ChevronLeft, ChevronRight } from './icons'
import { Popover } from './Popover'

interface DatePickerProps {
  /** ISO date, "YYYY-MM-DD" */
  value: string
  onChange: (value: string) => void
  /** earliest selectable ISO date */
  min?: string
  className?: string
}

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const MONTHS_GENITIVE = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const formatLong = (d: Date) => `${d.getDate()} ${MONTHS_GENITIVE[d.getMonth()]} ${d.getFullYear()}`

/** Themed replacement for <input type="date">: Russian labels, Monday-first weeks, follows the site theme. */
export function DatePicker({ value, onChange, min, className }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  // the month on screen, as an ISO date of its first day
  const [view, setView] = useState(value)
  const btnRef = useRef<HTMLButtonElement>(null)

  const selected = parseISODate(value)
  const viewDate = parseISODate(view)
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const [today] = useState(() => toISODate(new Date()))

  // 6 full weeks starting on Monday, so the panel height never jumps between months
  const offset = (new Date(year, month, 1).getDay() + 6) % 7
  const days = Array.from({ length: 42 }, (_, i) => new Date(year, month, 1 - offset + i))

  const canGoBack = !min || toISODate(new Date(year, month, 1)) > min
  const shiftMonth = (by: number) => setView(toISODate(new Date(year, month + by, 1)))

  const toggle = () => {
    setView(value)
    setOpen((v) => !v)
  }
  const pick = (iso: string) => {
    onChange(iso)
    setOpen(false)
  }
  /** keyboard: move the selection by days, never earlier than `min` */
  const moveBy = (daysDelta: number) => {
    const next = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate() + daysDelta)
    const iso = min && toISODate(next) < min ? min : toISODate(next)
    onChange(iso)
    setView(iso)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        toggle()
      }
      return
    }
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key]
    if (step) {
      e.preventDefault()
      moveBy(step)
    } else if (e.key === 'Escape') {
      e.stopPropagation() // do not close the modal the picker lives in
      setOpen(false)
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={onKeyDown}
        className={cn(
          'input flex cursor-pointer items-center justify-between gap-3 text-left',
          open && 'border-fg/50',
          className,
        )}
      >
        <span className="truncate tabular-nums">{formatLong(selected)}</span>
        <Calendar width={18} height={18} className="shrink-0 text-fg/50" />
      </button>
      {open && (
        <Popover anchorRef={btnRef} onClose={() => setOpen(false)} className="w-[19rem] p-4">
          <div role="dialog" aria-label="Выбор даты">
            <div className="flex items-center justify-between">
              <p className="pl-1.5 font-display text-sm font-semibold" aria-live="polite">
                {MONTHS[month]} {year}
              </p>
              <div className="flex gap-1">
                <NavButton label="Предыдущий месяц" disabled={!canGoBack} onClick={() => shiftMonth(-1)}>
                  <ChevronLeft width={18} height={18} />
                </NavButton>
                <NavButton label="Следующий месяц" onClick={() => shiftMonth(1)}>
                  <ChevronRight width={18} height={18} />
                </NavButton>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-7 text-center text-xs text-muted">
              {WEEKDAYS.map((d) => (
                <span key={d} className="py-1.5">
                  {d}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {days.map((d) => {
                const iso = toISODate(d)
                const isSelected = iso === value
                const disabled = !!min && iso < min
                return (
                  <button
                    key={iso}
                    type="button"
                    tabIndex={-1}
                    disabled={disabled}
                    aria-label={formatLong(d)}
                    aria-pressed={isSelected}
                    onClick={() => pick(iso)}
                    className={cn(
                      'mx-auto grid h-9 w-9 place-items-center rounded-full tabular-nums transition-colors',
                      isSelected
                        ? 'bg-accent font-semibold text-white'
                        : disabled
                          ? 'text-fg/20'
                          : cn(
                              'cursor-pointer hover:bg-fg/10',
                              d.getMonth() !== month ? 'text-fg/35' : iso === today ? 'font-semibold text-accent' : 'text-fg',
                            ),
                    )}
                  >
                    {d.getDate()}
                  </button>
                )
              })}
            </div>

            <div className="mt-3 flex justify-end border-t border-fg/10 pt-3">
              <button
                type="button"
                tabIndex={-1}
                disabled={!!min && today < min}
                onClick={() => pick(today)}
                className="cursor-pointer rounded-full px-3 py-1.5 text-xs text-fg/70 transition-colors hover:bg-fg/8 hover:text-fg disabled:cursor-default disabled:opacity-40"
              >
                Сегодня
              </button>
            </div>
          </div>
        </Popover>
      )}
    </>
  )
}

function NavButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-fg/70 transition-colors hover:bg-fg/8 hover:text-fg disabled:cursor-default disabled:opacity-25 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  )
}
