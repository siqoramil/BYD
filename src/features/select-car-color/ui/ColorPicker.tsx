import { getColor, useConfiguration, useCarStore } from '@/entities/car'
import { cn } from '@/shared/lib'

export function ColorPicker() {
  const { car, color } = useConfiguration()
  const setColor = useCarStore((s) => s.setColor)

  return (
    <fieldset>
      <legend className="mb-3 flex w-full justify-between text-sm">
        <span className="text-muted">Цвет</span>
        <span className="font-medium">{color.name}</span>
      </legend>
      <div className="flex flex-wrap gap-3">
        {car.colors.map((id) => {
          const c = getColor(id)
          const active = c.id === color.id
          return (
            <button
              key={id}
              onClick={() => setColor(id)}
              aria-label={c.name}
              aria-pressed={active}
              title={c.name}
              className={cn(
                'relative h-10 w-10 cursor-pointer rounded-full ring-offset-4 ring-offset-ink-900 transition-all duration-300 hover:scale-110',
                active ? 'ring-2 ring-fg' : 'ring-1 ring-fg/15',
              )}
              style={{
                background: `radial-gradient(circle at 30% 25%, rgb(255 255 255 / 0.65), ${c.hex} 45%, ${c.hex})`,
              }}
            />
          )
        })}
      </div>
    </fieldset>
  )
}
