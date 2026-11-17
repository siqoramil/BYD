import type { ReactNode } from 'react'
import { Icon, TiltCard } from '@/shared/ui'
import { formatUsd } from '@/shared/lib'
import type { Car } from '../model/types'
import { BODY_LABELS } from '../model/cars'
import { getColor } from '../model/colors'
import { getCarModel } from '../model/models3d'
import { CarImage } from './CarImage'

interface CarCardProps {
  car: Car
  /** slot for feature buttons (configure, test-drive …) */
  actions?: ReactNode
  /** slot rendered in the top-right corner (e.g. favourite toggle) */
  corner?: ReactNode
  /** makes the photo clickable (opens the 3D viewer) */
  onView?: () => void
}

export function CarCard({ car, actions, corner, onView }: CarCardProps) {
  const has3d = Boolean(getCarModel(car.id))
  const top = car.trims.reduce((a, t) => (t.rangeKm > a.rangeKm ? t : a), car.trims[0])
  const fastest = car.trims.reduce((a, t) => (t.accel < a.accel ? t : a), car.trims[0])

  return (
    <TiltCard className="group/card flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-[inherit]">
        <CarImage photo={car.photo} alt={`BYD ${car.name}`} className="transition-transform duration-700 ease-out group-hover/card:scale-[1.06]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-850 via-ink-850/10 to-black/30" />
        {onView && (
          <button
            type="button"
            onClick={onView}
            aria-label={`BYD ${car.name}: ${has3d ? 'смотреть в 3D' : 'открыть просмотр'}`}
            className="group/view absolute inset-0 cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-accent"
          >
            <span className="absolute top-1/2 left-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-xs font-medium whitespace-nowrap text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover/card:opacity-100 group-focus-visible/view:opacity-100">
              <Icon.Cube width={16} height={16} />
              {has3d ? 'Смотреть в 3D' : 'Открыть просмотр'}
            </span>
          </button>
        )}
        <div className="pointer-events-none absolute inset-x-5 top-5 flex items-start justify-between [&>*:last-child]:pointer-events-auto" style={{ transform: 'translateZ(30px)' }}>
          <span className="pointer-events-none flex gap-1.5">
            <span className="rounded-full bg-black/45 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/85 backdrop-blur">
              {BODY_LABELS[car.body]}
            </span>
            {has3d && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold tracking-wider text-white">
                <Icon.Cube width={12} height={12} />
                3D
              </span>
            )}
          </span>
          {corner}
        </div>
      </div>

      <div className="relative flex flex-1 flex-col p-6 pt-0" style={{ transformStyle: 'preserve-3d' }}>
        <div className="-mt-8" style={{ transform: 'translateZ(45px)' }}>
          <h3 className="font-display text-2xl font-bold drop-shadow-lg">BYD {car.name}</h3>
          <p className="text-sm text-muted">{car.tagline}</p>
        </div>
        <div className="mt-3 flex gap-1.5" aria-label="Доступные цвета">
          {car.colors.map((id) => {
            const c = getColor(id)
            return <span key={id} title={c.name} className="h-3.5 w-3.5 rounded-full ring-1 ring-fg/25" style={{ background: c.hex }} />
          })}
        </div>

        <dl className="mt-5 grid grid-cols-3 gap-3 border-y border-fg/8 py-4 text-center">
          <Spec label="Запас хода" value={`${top.rangeKm}`} unit="км" />
          <Spec label="0–100" value={fastest.accel.toFixed(1)} unit="с" />
          <Spec label="Мощность" value={`${fastest.powerHp}`} unit="л.с." />
        </dl>

        <div className="mt-5">
          <p className="text-xs text-muted">Цена</p>
          <p className="font-display text-xl font-bold">
            <span className="text-xs font-normal text-muted">от</span> {formatUsd(car.price)}
          </p>
        </div>
        {actions && <div className="mt-auto flex gap-2 pt-5">{actions}</div>}
      </div>
    </TiltCard>
  )
}

function Spec({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-muted">{label}</dt>
      <dd className="mt-1 font-display text-lg font-semibold">
        {value}
        <span className="ml-0.5 text-xs font-normal text-muted">{unit}</span>
      </dd>
    </div>
  )
}
