import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn, useTilt } from '@/shared/lib'

interface TiltCardProps {
  children: ReactNode
  className?: string
  maxDeg?: number
}

/** Card with real 3D perspective: children can use `translateZ` to float above the surface. */
export function TiltCard({ children, className, maxDeg = 8 }: TiltCardProps) {
  const { rotateX, rotateY, glare, handlers } = useTilt(maxDeg)
  return (
    <motion.div
      {...handlers}
      style={{ rotateX, rotateY, transformPerspective: 1000, transformStyle: 'preserve-3d' }}
      className={cn(
        'relative rounded-3xl border border-fg/8 bg-ink-850 will-change-transform',
        className,
      )}
    >
      {children}
      <motion.div
        aria-hidden
        style={{ background: glare }}
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 [div:hover>&]:opacity-100"
      />
    </motion.div>
  )
}
