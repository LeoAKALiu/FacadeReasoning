'use client'

import { cn } from '@/lib/utils'
import type { ParameterMapping } from '@/data/types'
import { ReliabilityDot } from '@/components/overview/ReliabilityDot'

interface ParameterMappingRowProps {
  mapping: ParameterMapping
  isSelected?: boolean
  onSelect?: (id: string) => void
}

/**
 * A single row in the parameter mapping table.
 * Shows: effective parameter → design parameter, confidence, category tag.
 */
export function ParameterMappingRow({
  mapping,
  isSelected,
  onSelect,
}: ParameterMappingRowProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 p-3 rounded-lg border transition-all cursor-pointer',
        isSelected
          ? 'border-accent bg-accent-subtle'
          : 'border-border bg-surface hover:border-border-strong hover:bg-surface-raised',
      )}
      onClick={() => onSelect?.(mapping.id)}
    >
      {/* Left: effective parameter */}
      <div className="flex-1 min-w-0">
        <p className="text-2xs text-ink-tertiary mb-0.5 uppercase tracking-wider">有效参数</p>
        <p className="text-sm font-medium text-ink-primary truncate">
          {mapping.effectiveParam.label}
        </p>
        <p className="mono text-xs text-accent mt-0.5">{mapping.effectiveParam.value}</p>
      </div>

      {/* Arrow */}
      <div className="flex flex-col items-center gap-1 shrink-0">
        <ReliabilityDot value={mapping.confidence} variant="pill" />
        <div className="flex items-center gap-1">
          <div className="w-8 h-px bg-border" />
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1 4H7M4.5 1.5L7 4L4.5 6.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-2xs text-ink-tertiary">映射</p>
      </div>

      {/* Right: design parameter */}
      <div className="flex-1 min-w-0 text-right">
        <p className="text-2xs text-ink-tertiary mb-0.5 uppercase tracking-wider">设计参数</p>
        <p className="text-sm font-medium text-ink-primary truncate">{mapping.designParam.label}</p>
        <span className="inline-block bg-infer-subtle border border-infer-muted text-infer text-2xs px-1.5 py-0.5 rounded mt-0.5">
          {mapping.designParam.category}
        </span>
      </div>

      {/* Expand indicator */}
      <div className="shrink-0 text-ink-tertiary">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
          className={cn('transition-transform', isSelected && 'rotate-180')}>
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}
