import type { CSSProperties, Ref } from 'react'

/**
 * One still of the car. `phone` = there is a separate portrait version (-m) for tall screens;
 * otherwise phones get the 16:9 picture cropped around `focus` (a CSS object-position).
 */
export function Film({ name, alt, eager, priority, phone, focus, imgRef, style, className = 'film' }: {
  name: string; alt: string; eager?: boolean; priority?: boolean; phone?: boolean; focus?: string
  imgRef?: Ref<HTMLImageElement>; style?: CSSProperties; className?: string
}) {
  const img = (
    <img
      ref={imgRef}
      className={className}
      src={`/film/${name}-d.webp`}
      width={1920}
      height={1072}
      alt={alt}
      style={{ objectPosition: focus, ...style }}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      draggable={false}
    />
  )
  if (!phone) return img
  return (
    <picture>
      <source media="(max-aspect-ratio: 1/1)" srcSet={`/film/${name}-m.webp`} />
      {img}
    </picture>
  )
}
