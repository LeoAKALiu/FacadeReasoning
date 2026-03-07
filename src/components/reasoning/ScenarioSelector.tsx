'use client'

import { cn } from '@/lib/utils'
import type { Scenario } from '@/data/types'
import { getRecommendedUsageMeta } from '@/lib/utils'
import { PlanPreviewCard } from '@/components/reasoning/PlanPreviewCard'

interface ScenarioSelectorProps {
  scenarios: Scenario[]
  selectedId: 'A' | 'B' | 'C'
  onSelect: (id: 'A' | 'B' | 'C') => void
  projectId?: string
}

/**
 * Horizontal tab group for switching between candidate design interpretations A / B / C.
 * Shows plan preview thumbnail and brief divergence note per scenario.
 */
export function ScenarioSelector({
  scenarios,
  selectedId,
  onSelect,
  projectId,
}: ScenarioSelectorProps) {
  return (
    <div className="space-y-3">
      {/* Tab buttons */}
      <div className="flex items-stretch gap-3">
        {scenarios.map((s) => {
          const isActive = s.id === selectedId
          const usageMeta = s.recommendedUsage
            ? getRecommendedUsageMeta(s.recommendedUsage)
            : null
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={cn(
                'flex-1 text-left p-4 rounded-lg border transition-all flex flex-col',
                isActive
                  ? 'border-accent bg-accent-subtle shadow-md shadow-accent/10'
                  : 'border-border bg-surface hover:border-border-strong hover:bg-surface-raised',
              )}
            >
              {projectId && (
                <div className="mb-3">
                  <PlanPreviewCard
                    projectId={projectId}
                    scenarioId={s.id}
                    label={`方案 ${s.id}`}
                    className="w-full"
                  />
                </div>
              )}
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={cn(
                    'w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold',
                    isActive ? 'bg-accent text-white' : 'bg-surface-overlay text-ink-tertiary',
                  )}
                >
                  {s.id}
                </span>
                <span
                  className={cn(
                    'text-xs font-semibold',
                    isActive ? 'text-ink-primary' : 'text-ink-secondary',
                  )}
                >
                  {s.label.split('—')[1]?.trim() ?? s.label}
                </span>
              </div>
              <p className="text-xs text-ink-tertiary leading-relaxed">{s.divergenceNote}</p>
              {usageMeta && (
                <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-2xs font-medium ${usageMeta.classes}`}>
                  {usageMeta.label}
                </span>
              )}
              {s.engineeringImpact && (
                <p className="text-2xs text-ink-tertiary mt-2 leading-relaxed">
                  {s.engineeringImpact.downstreamDifferenceSummary}
                </p>
              )}
            </button>
          )
        })}
      </div>

      {/* Selected scenario description */}
      {scenarios.find((s) => s.id === selectedId) && (
        <div className="p-3 bg-surface-raised rounded-lg border border-border text-xs text-ink-secondary leading-relaxed">
          <span className="font-medium text-ink-primary">方案说明：</span>
          {scenarios.find((s) => s.id === selectedId)!.description}
        </div>
      )}
    </div>
  )
}
