import { cn } from '@/shared/lib'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="relative grid h-9 w-14 place-items-center rounded-[50%] border-[1.5px] border-fg/90">
        <span className="font-display text-[13px] font-bold tracking-[0.18em] pl-[0.18em]">BYD</span>
      </span>
      <span className="hidden text-[10px] leading-tight uppercase tracking-[0.28em] text-fg/60 sm:block">
        Showroom
        <br />
        Ташкент
      </span>
    </span>
  )
}
