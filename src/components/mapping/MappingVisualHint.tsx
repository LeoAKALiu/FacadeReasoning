'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { getCaseAssetUrl } from '@/lib/utils'

interface MappingVisualHintProps {
  projectId: string
  /** Optional: evidence thumbnail (e.g. detail-01.png or first evidence region) */
  evidenceThumbUrl?: string | null
  /** Design param label for the right side */
  paramLabel: string
  className?: string
}

/**
 * Small visual: evidence thumb → arrow → param label.
 * Used inside ParameterMappingRow to show evidence-to-parameter flow.
 */
export function MappingVisualHint({
  projectId,
  evidenceThumbUrl,
  paramLabel,
  className,
}: MappingVisualHintProps) {
  const thumbUrl = evidenceThumbUrl ?? getCaseAssetUrl(projectId, 'detail-01.png')

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative w-10 h-10 rounded border border-border bg-surface-raised overflow-hidden shrink-0">
        <Image
          src={thumbUrl}
          alt=""
          fill
          className="object-cover"
          sizes="40px"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none'
          }}
          unoptimized
        />
      </div>
      <svg className="w-4 h-4 text-ink-tertiary shrink-0" viewBox="0 0 16 16" fill="none">
        <path d="M2 8h8m0 0L6 5m4 3l-2 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-2xs text-ink-secondary truncate max-w-[80px]" title={paramLabel}>
        {paramLabel}
      </span>
    </div>
  )
}
