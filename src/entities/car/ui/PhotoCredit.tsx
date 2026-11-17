import { cn } from '@/shared/lib'
import type { CarPhoto } from '../model/types'
import { LICENSE_URLS } from '../model/photos'

/** Attribution required by CC BY-SA. */
export function PhotoCredit({ photo, className }: { photo: CarPhoto; className?: string }) {
  return (
    <p className={cn('text-[10px] text-fg/45', className)}>
      Фото:{' '}
      <a href={photo.source} target="_blank" rel="noreferrer" className="underline-offset-2 hover:text-fg hover:underline">
        {photo.author}
      </a>
      ,{' '}
      <a href={LICENSE_URLS[photo.license]} target="_blank" rel="noreferrer" className="underline-offset-2 hover:text-fg hover:underline">
        {photo.license}
      </a>
    </p>
  )
}
