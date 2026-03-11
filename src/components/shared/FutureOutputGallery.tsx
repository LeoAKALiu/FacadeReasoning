'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { getCaseAssetUrl } from '@/lib/utils'

const GALLERY_ITEMS = [
  { key: 'structure-sketch.svg', label: '结构草图' },
  { key: 'parameter-preview.svg', label: '参数表' },
  { key: 'component-candidates.svg', label: '构件候选' },
] as const

function getGalleryAssetKey(projectId: string, key: (typeof GALLERY_ITEMS)[number]['key']): string {
  if (projectId === 'case-01' && key === 'parameter-preview.svg') {
    return 'parameter-preview.png'
  }
  return key
}

interface FutureOutputGalleryProps {
  projectId: string
  /** Include component-candidates only for cases that have it (e.g. case-02, case-03) */
  includeComponentCandidates?: boolean
  className?: string
}

/**
 * Carousel or grid of future output preview images: structure sketch, parameter table, component candidates.
 */
export function FutureOutputGallery({
  projectId,
  includeComponentCandidates = true,
  className,
}: FutureOutputGalleryProps) {
  const [index, setIndex] = useState(0)
  const items = includeComponentCandidates
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((i) => i.key !== 'component-candidates.svg')

  useEffect(() => {
    if (items.length <= 1) return
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 4500)
    return () => clearInterval(t)
  }, [items.length])

  return (
    <div className={cn('rounded-lg border border-border bg-surface-raised overflow-hidden', className)}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <p className="text-xs font-medium text-ink-primary">未来成果物预览</p>
        {items.length > 1 && (
          <div className="flex gap-1">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`第 ${i + 1} 项`}
                onClick={() => setIndex(i)}
                className={cn(
                  'w-1.5 h-1.5 rounded-full transition-all',
                  i === index ? 'bg-accent' : 'bg-border',
                )}
              />
            ))}
          </div>
        )}
      </div>
      <div className="relative aspect-video min-h-[140px]">
        {items.map((item, i) => (
          <div
            key={item.key}
            className={cn(
              'absolute inset-0 flex items-center justify-center p-4 transition-opacity duration-300',
              i === index ? 'opacity-100 z-10' : 'opacity-0 z-0',
            )}
          >
            <div className="relative w-full h-full">
              <Image
                src={getCaseAssetUrl(projectId, getGalleryAssetKey(projectId, item.key))}
                alt={item.label}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 400px"
                unoptimized
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-2xs text-ink-tertiary text-center py-2 border-t border-border">
        {items[index]?.label}
      </p>
    </div>
  )
}
