import { cn, getSourceColors, getSourceLabel } from '@/lib/utils'
import type { EvidenceSource } from '@/data/types'

interface SourceBadgeProps {
  source: EvidenceSource
  /** 'badge' = pill badge, 'dot' = small dot only, 'inline' = dot + label inline */
  variant?: 'badge' | 'dot' | 'inline'
  className?: string
}

/**
 * Color-coded label for the epistemic status of a parameter or evidence item.
 * Four states: direct_observation (green), rule_inference (blue),
 * ai_completion (purple), pending_review (amber).
 */
export function SourceBadge({ source, variant = 'badge', className }: SourceBadgeProps) {
  const colors = getSourceColors(source)
  const label = getSourceLabel(source)

  if (variant === 'dot') {
    return (
      <span
        title={label}
        className={cn('inline-block w-2 h-2 rounded-full shrink-0', colors.dot, className)}
      />
    )
  }

  if (variant === 'inline') {
    return (
      <span className={cn('flex items-center gap-1.5', className)}>
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', colors.dot)} />
        <span className={cn('text-xs', colors.text)}>{label}</span>
      </span>
    )
  }

  // default: badge
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border',
        colors.bg,
        colors.text,
        colors.border,
        className,
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', colors.dot)} />
      {label}
    </span>
  )
}
