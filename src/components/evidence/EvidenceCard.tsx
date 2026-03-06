'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Evidence } from '@/data/types'
import { SourceBadge } from './SourceBadge'

const CATEGORY_LABELS: Record<string, string> = {
  material: '材质',
  proportion: '比例',
  pattern: '图案',
  color: '色彩',
  texture: '肌理',
  geometry: '几何',
  opening: '开口',
  joint: '接缝',
  module: '模数',
}

interface EvidenceCardProps {
  evidence: Evidence
  isSelected?: boolean
  onSelect?: (id: string) => void
}

/**
 * Card displaying a single evidence item with category, value, confidence bar,
 * source badge, and expandable basis text.
 */
export function EvidenceCard({ evidence: ev, isSelected, onSelect }: EvidenceCardProps) {
  const [expanded, setExpanded] = useState(false)
  const confidencePct = Math.round(ev.confidence * 100)

  const confidenceColor =
    ev.confidence >= 0.85
      ? '#22C55E'
      : ev.confidence >= 0.65
      ? '#EAB308'
      : '#F97316'

  return (
    <div
      className={cn(
        'card p-4 cursor-pointer transition-all hover:border-border-strong group',
        isSelected && 'border-accent bg-accent-subtle',
        !isSelected && 'hover:bg-surface-raised',
      )}
      onClick={() => onSelect?.(ev.id)}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="label-xs">{CATEGORY_LABELS[ev.category] ?? ev.category}</span>
          </div>
          <p className="text-sm font-medium text-ink-primary">{ev.label}</p>
        </div>
        <SourceBadge source={ev.source} variant="badge" />
      </div>

      {/* Value */}
      <div className="flex items-center gap-2 mb-3">
        <span className="mono text-sm text-accent font-medium">{ev.value}</span>
      </div>

      {/* Confidence bar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="h-1 flex-1 bg-surface-overlay rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${confidencePct}%`, backgroundColor: confidenceColor }}
          />
        </div>
        <span
          className="mono text-2xs tabular-nums shrink-0"
          style={{ color: confidenceColor }}
        >
          {confidencePct}%
        </span>
      </div>

      {/* Basis text (expandable) */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setExpanded(!expanded)
        }}
        className="flex items-center gap-1.5 text-xs text-ink-tertiary hover:text-ink-secondary transition-colors w-full text-left"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className={cn('shrink-0 transition-transform', expanded && 'rotate-90')}
        >
          <path d="M3 2L7 5L3 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>查看依据</span>
      </button>

      {expanded && (
        <div className="mt-2 p-2.5 bg-surface-overlay rounded-md text-xs text-ink-secondary leading-relaxed border border-border-subtle animate-fade-in">
          {ev.basisText}
        </div>
      )}

      {/* Region indicator */}
      {ev.region && (
        <div className="mt-2 flex items-center gap-1.5 text-2xs text-ink-tertiary">
          <span className="w-2 h-2 border border-accent/50 rounded-sm inline-block" />
          <span>已标注图像区域</span>
        </div>
      )}
    </div>
  )
}
