import { useEffect, useRef, useState } from 'react'
import { cn } from '@/shared/lib'

interface BydLoaderProps {
  /** 0…1 — draws the progress along the logo outline; `null` = unknown (endless sweep) */
  progress?: number | null
  label?: string
  className?: string
}

// logo oval, drawn clockwise starting from the top so the progress grows like a clock hand
const OVAL = 'M80 8 A72 40 0 1 1 79.99 8 Z'

/** Loading indicator: the BYD badge "breathes" while its outline fills with the progress. */
export function BydLoader({ progress = null, label, className }: BydLoaderProps) {
  const known = progress !== null
  const pct = known ? Math.round(Math.min(Math.max(progress, 0), 1) * 100) : 0

  // the shown number counts up to the real one, so it ticks instead of jumping between network chunks
  const [shown, setShown] = useState(0)
  const shownRef = useRef(0)
  useEffect(() => {
    let raf = 0
    const step = () => {
      const gap = pct - shownRef.current
      if (gap === 0) return
      shownRef.current += Math.sign(gap) * Math.max(1, Math.round(Math.abs(gap) * 0.12))
      setShown(shownRef.current)
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [pct])

  return (
    <div
      role="progressbar"
      aria-label={label ?? 'Загрузка'}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={known ? pct : undefined}
      className={cn('flex flex-col items-center gap-5 text-center', className)}
    >
      <div className="relative">
        {/* soft glow behind the badge, pulsing in sync with the letters */}
        <div aria-hidden className="byd-loader-glow absolute inset-[-30%] rounded-[50%] bg-accent/40 blur-3xl" />
        <svg viewBox="0 0 160 96" className="relative w-40 overflow-visible sm:w-48" fill="none" aria-hidden>
          <path d={OVAL} className="stroke-fg/15" strokeWidth="2.5" />
          <path
            d={OVAL}
            pathLength={100}
            strokeWidth="2.5"
            strokeLinecap="round"
            className={cn('stroke-accent', !known && 'byd-loader-sweep')}
            style={
              known
                ? { strokeDasharray: 100, strokeDashoffset: 100 - shown, filter: 'drop-shadow(0 0 6px var(--color-accent))' }
                : { strokeDasharray: '28 72', filter: 'drop-shadow(0 0 6px var(--color-accent))' }
            }
          />
          <text
            x="82"
            y="59"
            textAnchor="middle"
            className="byd-loader-text fill-fg font-display text-[30px] font-bold"
            style={{ letterSpacing: '0.16em' }}
          >
            BYD
          </text>
        </svg>
      </div>
      <p className="text-sm text-muted">
        {label}
        {known && (
          <>
            {label && ' · '}
            <span className="font-display font-semibold text-fg tabular-nums">{shown}%</span>
          </>
        )}
      </p>
    </div>
  )
}
