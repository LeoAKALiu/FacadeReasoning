import { getRecommendedUsageMeta } from '@/lib/utils'
import type { RecommendedUsage } from '@/data/types'

interface UsageRecommendationCardProps {
  usage?: RecommendedUsage
  reason?: string
}

/**
 * Productized recommendation describing whether current results can be used downstream.
 */
export function UsageRecommendationCard({
  usage,
  reason,
}: UsageRecommendationCardProps) {
  if (!usage) return null

  const meta = getRecommendedUsageMeta(usage)

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label-xs mb-2">当前结果使用建议</p>
          <p className="text-sm font-semibold text-ink-primary">{meta.label}</p>
          <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
            {reason ?? meta.description}
          </p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${meta.classes}`}>
          {meta.label}
        </span>
      </div>
    </div>
  )
}
