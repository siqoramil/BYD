import { useEffect, useLayoutEffect, useRef, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import { cn } from '@/shared/lib'

interface PopoverProps {
  /** the element the panel is attached to */
  anchorRef: RefObject<HTMLElement | null>
  onClose: () => void
  /** stretch the panel to the anchor's width */
  matchWidth?: boolean
  className?: string
  children: ReactNode
}

const GAP = 6
const MARGIN = 8

/**
 * Floating panel under (or above, when there is no room) its anchor.
 * Rendered into <body>, so it is never clipped by a scrollable / transformed parent such as a modal.
 * Focus stays on the anchor — keyboard handling belongs to the component that owns it.
 */
export function Popover({ anchorRef, onClose, matchWidth, className, children }: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const place = () => {
      const anchor = anchorRef.current
      const pop = ref.current
      if (!anchor || !pop) return
      const a = anchor.getBoundingClientRect()
      if (matchWidth) pop.style.width = `${a.width}px`
      const { offsetWidth: w, offsetHeight: h } = pop
      const below = window.innerHeight - a.bottom - GAP - MARGIN
      const above = a.top - GAP - MARGIN
      const up = h > below && above > below
      pop.style.top = `${up ? Math.max(MARGIN, a.top - GAP - h) : a.bottom + GAP}px`
      pop.style.left = `${Math.max(MARGIN, Math.min(a.left, window.innerWidth - w - MARGIN))}px`
    }
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  })

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (ref.current?.contains(t) || anchorRef.current?.contains(t)) return
      onClose()
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [anchorRef, onClose])

  return createPortal(
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      // keep the focus on the anchor, so its keyboard handling keeps working
      onMouseDown={(e) => e.preventDefault()}
      className={cn(
        'fixed z-[70] rounded-2xl border border-fg/10 bg-ink-850 text-sm text-fg shadow-2xl shadow-black/40',
        className,
      )}
    >
      {children}
    </motion.div>,
    document.body,
  )
}
