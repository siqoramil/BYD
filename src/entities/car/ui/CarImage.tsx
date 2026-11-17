import { cn } from '@/shared/lib'
import type { CarPhoto } from '../model/types'
import { photoUrl } from '../model/photos'

interface CarImageProps {
  photo: CarPhoto
  alt: string
  /** `sizes` attribute — how wide the image renders */
  sizes?: string
  priority?: boolean
  className?: string
}

export function CarImage({ photo, alt, sizes = '(min-width: 1024px) 33vw, 100vw', priority, className }: CarImageProps) {
  return (
    <img
      src={photoUrl(photo.file, 960)}
      srcSet={`${photoUrl(photo.file, 960)} 960w, ${photoUrl(photo.file, 1920)} 1920w`}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      draggable={false}
      style={{ objectPosition: photo.position ?? '50% 60%' }}
      className={cn('h-full w-full object-cover select-none', className)}
    />
  )
}
