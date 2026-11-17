import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { Reveal } from './Reveal'

interface SectionHeadingProps {
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({ eyebrow, title, description, align = 'left', className }: SectionHeadingProps) {
  return (
    <Reveal className={cn(align === 'center' && 'mx-auto text-center', 'max-w-3xl', className)}>
      <p className="mb-4 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent">
        <span className="h-px w-8 bg-accent" />
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl leading-[1.05] font-bold text-balance sm:text-5xl">{title}</h2>
      {description && <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{description}</p>}
    </Reveal>
  )
}
