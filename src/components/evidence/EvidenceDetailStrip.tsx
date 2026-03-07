'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { getCaseAssetUrl } from '@/lib/utils'
import type { Evidence } from '@/data/types'

export interface DetailSlot {
  /** Optional evidence id to highlight when this slot is hovered */
  evidenceId?: string
  /** Image filename (e.g. detail-01.png) */
  imageKey: string
  caption?: string
}

interface EvidenceDetailStripProps {
  projectId: string
  /** 2–4 detail slots; order can match evidence or review items */
  slots: DetailSlot[]
  /** Currently hovered evidence id (from parent) */
  highlightedEvidenceId?: string | null
  /** Callback when user hovers a slot — parent can set highlightedEvidenceId */
  onSlotHover?: (evidenceId: string | null) => void
  className?: string
}

/**
 * Horizontal strip of 2–4 detail crop thumbnails.
 * Hovering a slot highlights the corresponding region on the main image and can highlight the evidence card.
 */
export function EvidenceDetailStrip({
  projectId,
  slots,
  highlightedEvidenceId = null,
  onSlotHover,
  className,
}: EvidenceDetailStripProps) {
  const [errors, setErrors] = useState<Record<number, boolean>>({})

  if (slots.length === 0) return null

  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      <p className="text-2xs text-ink-tertiary w-full mb-0.5">局部细节证据</p>
      <div className="flex flex-wrap gap-3">
        {slots.map((slot, i) => {
          const url = getCaseAssetUrl(projectId, slot.imageKey)
          const hasError = errors[i]
          const isHighlighted = slot.evidenceId && slot.evidenceId === highlightedEvidenceId

          return (
            <button
              key={slot.evidenceId ?? i}
              type="button"
              className={cn(
                'relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 shrink-0',
                'bg-surface-raised border-border hover:border-accent/60',
                isHighlighted && 'border-accent ring-2 ring-accent/30',
              )}
              onMouseEnter={() => onSlotHover?.(slot.evidenceId ?? null)}
              onMouseLeave={() => onSlotHover?.(null)}
            >
              {!hasError ? (
                <Image
                  src={url}
                  alt={slot.caption ?? `细节 ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                  onError={() => setErrors((prev) => ({ ...prev, [i]: true }))}
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-surface-overlay">
                  <span className="text-2xs text-ink-tertiary">细节 {i + 1}</span>
                </div>
              )}
              {slot.caption && (
                <span className="absolute bottom-0 left-0 right-0 bg-canvas/80 text-2xs text-ink-secondary py-0.5 px-1 truncate">
                  {slot.caption}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
