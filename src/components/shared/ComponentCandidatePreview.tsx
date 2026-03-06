import type { FutureOutputComponentCandidate } from '@/data/types'
import { ParameterImportanceBadge } from './ParameterImportanceBadge'

interface ComponentCandidatePreviewProps {
  items: FutureOutputComponentCandidate[]
}

/**
 * Component-level output preview for future structural expression artifacts.
 */
export function ComponentCandidatePreview({
  items,
}: ComponentCandidatePreviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-border bg-surface-raised p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <p className="text-sm font-semibold text-ink-primary">{item.label}</p>
            <ParameterImportanceBadge level={item.importanceLevel} />
          </div>
          <div className="space-y-1 mb-2">
            {item.candidates.map((candidate) => (
              <p key={candidate} className="text-xs text-ink-secondary leading-relaxed">
                {candidate}
              </p>
            ))}
          </div>
          <p className="text-2xs text-ink-tertiary leading-relaxed">{item.note}</p>
        </div>
      ))}
    </div>
  )
}
