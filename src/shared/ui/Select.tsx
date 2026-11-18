import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { cn } from '@/shared/lib'
import { Check, ChevronDown } from './icons'
import { Popover } from './Popover'

export interface SelectOption<T extends string = string> {
  value: T
  label: string
}

interface SelectProps<T extends string> {
  value: T
  options: SelectOption<T>[]
  onChange: (value: T) => void
  className?: string
}

/** Themed replacement for the native <select>: same `.input` look, own dropdown list. */
export function Select<T extends string>({ value, options, onChange, className }: SelectProps<T>) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const btnRef = useRef<HTMLButtonElement>(null)
  const listId = useId()

  const selectedIndex = options.findIndex((o) => o.value === value)
  const selected = options[selectedIndex]

  useEffect(() => {
    if (open) document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [open, active, listId])

  const toggle = () => {
    setActive(Math.max(selectedIndex, 0))
    setOpen((v) => !v)
  }
  const pick = (i: number) => {
    const option = options[i]
    if (option) onChange(option.value)
    setOpen(false)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        toggle()
      }
      return
    }
    const last = options.length - 1
    switch (e.key) {
      case 'Escape':
        e.stopPropagation() // do not close the modal the select lives in
        setOpen(false)
        break
      case 'Tab':
        setOpen(false)
        break
      case 'ArrowDown':
        e.preventDefault()
        setActive((i) => Math.min(i + 1, last))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActive((i) => Math.max(i - 1, 0))
        break
      case 'Home':
        e.preventDefault()
        setActive(0)
        break
      case 'End':
        e.preventDefault()
        setActive(last)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        pick(active)
        break
    }
  }

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        onClick={toggle}
        onKeyDown={onKeyDown}
        className={cn(
          'input flex cursor-pointer items-center justify-between gap-3 text-left',
          open && 'border-fg/50',
          className,
        )}
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDown
          width={18}
          height={18}
          className={cn('shrink-0 text-fg/50 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      {open && (
        <Popover anchorRef={btnRef} onClose={() => setOpen(false)} matchWidth className="p-1.5">
          <ul id={listId} role="listbox" className="max-h-64 overflow-y-auto overscroll-contain">
            {options.map((o, i) => (
              <li
                key={o.value}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === selectedIndex}
                onPointerMove={() => setActive(i)}
                onClick={() => pick(i)}
                className={cn(
                  'flex h-10 cursor-pointer items-center justify-between gap-3 rounded-xl px-3',
                  i === active && 'bg-fg/8',
                  i === selectedIndex ? 'font-medium text-fg' : 'text-fg/75',
                )}
              >
                <span className="truncate">{o.label}</span>
                {i === selectedIndex && <Check width={16} height={16} className="shrink-0 text-accent" />}
              </li>
            ))}
          </ul>
        </Popover>
      )}
    </>
  )
}
