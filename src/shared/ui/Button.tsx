import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/lib'

type Variant = 'primary' | 'outline' | 'ghost' | 'light'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-white shadow-[0_10px_40px_-10px_var(--color-accent)] hover:bg-accent-hover',
  outline: 'border border-fg/20 text-fg hover:border-fg/60 hover:bg-fg/5',
  ghost: 'text-fg/70 hover:text-fg hover:bg-fg/5',
  light: 'bg-fg text-ink-950 hover:bg-fg/85',
}
const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-14 px-8 text-base',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: ReactNode
}

export function Button({ variant = 'primary', size = 'md', icon, className, children, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'group inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-300 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {children}
      {icon && <span className="transition-transform duration-300 group-hover:translate-x-0.5">{icon}</span>}
    </button>
  )
}
