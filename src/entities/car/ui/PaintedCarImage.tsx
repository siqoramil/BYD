import { cn } from '@/shared/lib'
import type { CarPhoto } from '../model/types'
import { photoUrl } from '../model/photos'

interface PaintedCarImageProps {
  photo: CarPhoto
  alt: string
  priority?: boolean
  className?: string
}

/** The real, untouched photo of the model. */
export function PaintedCarImage({ photo, alt, priority, className }: PaintedCarImageProps) {
  return (
    <div className={cn('relative h-full w-full overflow-hidden', className)}>
      <img
        src={photoUrl(photo.file, 1920)}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        draggable={false}
        style={{ objectPosition: photo.position ?? '50% 60%' }}
        className="absolute inset-0 h-full w-full object-cover select-none"
      />
    </div>
  )
}
