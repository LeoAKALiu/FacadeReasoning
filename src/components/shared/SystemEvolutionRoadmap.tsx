'use client'

import Image from 'next/image'
import type { EvolutionPath } from '@/data/types'
import { getCaseAssetUrl } from '@/lib/utils'

interface SystemEvolutionRoadmapProps {
  evolution?: EvolutionPath
  /** When set, each stage shows a small thumbnail (evidence UI, sketch, report). */
  projectId?: string
  layout?: 'grid' | 'stacked'
}

const STAGE_THUMB_KEYS = ['parameter-preview.svg', 'structure-sketch.svg', 'parameter-preview.svg'] as const

function getStageThumb(projectId: string, key: (typeof STAGE_THUMB_KEYS)[number]): string {
  if (projectId === 'case-01' && key === 'parameter-preview.svg') {
    return 'parameter-preview.png'
  }
  return key
}

/**
 * Shows the product evolution path from current demo to future delivery system.
 * Optional: stage thumbnails when projectId is provided.
 */
export function SystemEvolutionRoadmap({
  evolution,
  projectId,
  layout = 'grid',
}: SystemEvolutionRoadmapProps) {
  if (!evolution) return null

  const stages = [
    evolution.currentStage,
    evolution.nextStage,
    evolution.targetStage,
  ]

  return (
    <div className="card p-4">
      <div className="mb-4">
        <p className="label-xs mb-1">系统演进路径</p>
        <h3 className="text-sm font-semibold text-ink-primary">从当前 demo 到未来系统</h3>
      </div>

      <div className={layout === 'stacked' ? 'space-y-3' : 'grid grid-cols-1 lg:grid-cols-3 gap-3'}>
        {stages.map((stage, index) => (
          <div
            key={stage.title}
            className={
              layout === 'stacked'
                ? 'rounded-lg border border-border bg-surface-raised p-4 flex gap-4 items-start'
                : 'rounded-lg border border-border bg-surface-raised p-4'
            }
          >
            {projectId && (
              <div
                className={
                  layout === 'stacked'
                    ? 'relative w-28 sm:w-36 shrink-0 aspect-video rounded border border-border bg-surface overflow-hidden'
                    : 'relative aspect-video w-full rounded border border-border bg-surface mb-3 overflow-hidden'
                }
              >
                <Image
                  src={getCaseAssetUrl(projectId, getStageThumb(projectId, STAGE_THUMB_KEYS[index]))}
                  alt=""
                  fill
                  className="object-contain p-2"
                  sizes="140px"
                  unoptimized
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-md bg-accent-subtle border border-accent-muted text-accent text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <p className="text-sm font-semibold text-ink-primary">{stage.title}</p>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed mb-3">{stage.description}</p>
              <div className="space-y-1.5">
                {stage.bullets.map((bullet) => (
                  <div key={bullet} className="text-xs text-ink-tertiary flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
