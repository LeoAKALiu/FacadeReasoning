import { cn, getImportanceMeta } from '@/lib/utils'
import type { ParameterImportanceLevel } from '@/data/types'

interface ParameterImportanceBadgeProps {
  level?: ParameterImportanceLevel
  className?: string
}

/**
 * Badge for parameter importance. This is intentionally separate from reliability.
 */
export function ParameterImportanceBadge({
  level,
  className,
}: ParameterImportanceBadgeProps) {
  if (!level) return null

  const meta = getImportanceMeta(level)

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-2xs font-medium',
        meta.classes,
        className,
      )}
    >
      {meta.label}
    </span>
  )
}
