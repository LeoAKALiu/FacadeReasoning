'use client'

import { cn } from '@/lib/utils'
import type { Scenario } from '@/data/types'

interface ScenarioSelectorProps {
  scenarios: Scenario[]
  selectedId: 'A' | 'B' | 'C'
  onSelect: (id: 'A' | 'B' | 'C') => void
}

/**
 * Horizontal tab group for switching between candidate design interpretations A / B / C.
 * Shows a brief divergence note below each label.
 */
export function ScenarioSelector({
  scenarios,
  selectedId,
  onSelect,
}: ScenarioSelectorProps) {
  return (
    <div className="space-y-3">
      {/* Tab buttons */}
      <div className="flex items-stretch gap-3">
        {scenarios.map((s) => {
          const isActive = s.id === selectedId
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={cn(
                'flex-1 text-left p-4 rounded-lg border transition-all',
                isActive
                  ? 'border-accent bg-accent-subtle shadow-md shadow-accent/10'
                  : 'border-border bg-surface hover:border-border-strong hover:bg-surface-raised',
              )}
            >
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
