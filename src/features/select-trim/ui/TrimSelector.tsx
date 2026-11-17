import { useConfiguration, useCarStore } from '@/entities/car'
import { cn, formatUsd } from '@/shared/lib'

export function TrimSelector() {
  const { car, trim } = useConfiguration()
  const setTrim = useCarStore((s) => s.setTrim)

  return (
    <fieldset>
      <legend className="mb-3 text-sm text-muted">Комплектация</legend>
      <div className="grid gap-2">
        {car.trims.map((t) => {
          const active = t.id === trim.id
          return (
            <button
              key={t.id}
              onClick={() => setTrim(t.id)}
              aria-pressed={active}
              className={cn(
                'flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors',
                active ? 'border-fg bg-fg/6' : 'border-fg/10 hover:border-fg/30',
              )}
            >
              <span>
                <span className="block text-sm font-medium">{t.name}</span>
                <span className="text-xs text-muted">
                  {t.rangeKm} км · {t.powerHp} л.с. · 0–100 за {t.accel} с
                </span>
              </span>
              <span className="text-sm text-fg/80">{t.priceDelta ? `+${formatUsd(t.priceDelta)}` : 'Базовая'}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
