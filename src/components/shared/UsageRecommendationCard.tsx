import { getRecommendedUsageMeta } from '@/lib/utils'
import type { RecommendedUsage } from '@/data/types'

interface UsageRecommendationCardProps {
  usage?: RecommendedUsage
  reason?: string
  /** When true, show only one conclusion line + one boundary line. */
  compact?: boolean
}

/** Truncate to first sentence for compact mode. */
function firstSentence(s: string): string {
  const end = s.search(/[。.!?]\s/)
  return end >= 0 ? s.slice(0, end + 1) : s
}

/**
 * Productized recommendation describing whether current results can be used downstream.
 */
export function UsageRecommendationCard({
  usage,
  reason,
  compact = false,
}: UsageRecommendationCardProps) {
  if (!usage) return null

  const meta = getRecommendedUsageMeta(usage)
  const body = reason ?? meta.description
  const oneLine = compact ? firstSentence(body) : body

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {!compact && <p className="label-xs mb-1">当前结果使用建议</p>}
          <p className="text-sm font-semibold text-ink-primary">{meta.label}</p>
          {oneLine && (
            <p className={`text-ink-secondary mt-0.5 leading-snug ${compact ? 'text-2xs' : 'text-xs'}`}>
              {oneLine}
            </p>
          )}
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-2xs font-medium ${meta.classes}`}>
          {meta.label}
        </span>
      </div>
    </div>
  )
}
