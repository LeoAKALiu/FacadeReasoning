'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { getCaseAssetUrl } from '@/lib/utils'

interface PlanPreviewCardProps {
  projectId: string
  scenarioId: 'A' | 'B' | 'C'
  /** Optional custom image (e.g. scenario-specific sketch); falls back to structure-sketch.svg */
  imageUrl?: string | null
  label?: string
  className?: string
}

/**
 * Small thumbnail for a scenario: structure sketch or plan consequence.
 * Shown at top or side of scenario card in ScenarioSelector.
 */
export function PlanPreviewCard({
  projectId,
  scenarioId,
  imageUrl,
  label,
  className,
}: PlanPreviewCardProps) {
  const url = imageUrl ?? getCaseAssetUrl(projectId, 'structure-sketch.svg')

  return (
    <div className={cn('rounded-lg border border-border bg-surface-raised overflow-hidden', className)}>
      <div className="relative aspect-[1.8/1] w-full min-h-[56px]">
        <Image
          src={url}
          alt={label ?? `方案 ${scenarioId} 结构示意`}
          fill
          className="object-contain p-1"
          sizes="120px"
          unoptimized
        />
      </div>
      {label && (
        <p className="text-2xs text-ink-tertiary text-center py-1 px-2 border-t border-border">
          {label}
        </p>
      )}
    </div>
  )
}
