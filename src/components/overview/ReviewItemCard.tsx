import { cn, getPriorityStyle } from '@/lib/utils'
import type { ReviewItem } from '@/data/types'

interface ReviewItemCardProps {
  item: ReviewItem
  index: number
}

/**
 * Card displaying a single review item that requires manual human verification.
 * Shows priority badge, issue description, and suggested action.
 */
export function ReviewItemCard({ item, index }: ReviewItemCardProps) {
  const priority = getPriorityStyle(item.priority)

  return (
    <div className="card p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-review-subtle border border-review-muted text-review text-2xs font-bold flex items-center justify-center shrink-0">
            {index}
          </span>
          <h4 className="text-sm font-medium text-ink-primary">{item.parameterLabel}</h4>
        </div>
        <span className={cn('text-2xs px-2 py-0.5 rounded-full font-medium shrink-0', priority.classes)}>
          {priority.label}
        </span>
      </div>

      {item.blocksUsage && (
        <div className="rounded-md border border-review-muted bg-review-subtle px-2.5 py-2 text-xs text-review">
          该项会直接影响“当前结果是否可进入正式工程表达”。
        </div>
      )}

      {/* Current value */}
      <div className="flex items-center gap-2">
        <span className="text-2xs text-ink-tertiary uppercase tracking-wider shrink-0">当前值</span>
        <span className="mono text-xs text-review bg-review-subtle border border-review-muted px-2 py-0.5 rounded">
          {item.currentValue}
        </span>
      </div>

      {/* Issue */}
      <div>
        <p className="text-2xs text-ink-tertiary mb-1 uppercase tracking-wider">问题描述</p>
        <p className="text-xs text-ink-secondary leading-relaxed">{item.issue}</p>
      </div>

      {/* Suggestion */}
      <div className="p-2.5 bg-observe-subtle border border-observe-muted rounded-md">
        <div className="flex items-start gap-2">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 mt-0.5 text-observe">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
            <path d="M6 4V6.5M6 8V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="text-xs text-observe leading-relaxed">{item.suggestion}</p>
        </div>
      </div>

      {item.relatedParameterKeys && item.relatedParameterKeys.length > 0 && (
        <div className="text-2xs text-ink-tertiary">
          关联关键参数：{item.relatedParameterKeys.join(' / ')}
        </div>
      )}
    </div>
  )
}
