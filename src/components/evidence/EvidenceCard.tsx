'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { getReliabilityLevel, reliabilityToColor } from '@/lib/utils'
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
  onHover?: (id: string | null) => void
}

/**
 * Card displaying a single evidence item: category, value, importance note,
 * reliability level (not progress bar), source badge, and expandable "查看依据".
 */
export function EvidenceCard({ evidence: ev, isSelected, onSelect, onHover }: EvidenceCardProps) {
  const [expanded, setExpanded] = useState(false)
  const confidencePct = Math.round(ev.confidence * 100)
  const level = getReliabilityLevel(ev.confidence)
  const levelColor = reliabilityToColor(ev.confidence)

  return (
    <div
      className={cn(
        'card p-4 cursor-pointer transition-all hover:border-border-strong group',
        isSelected && 'border-accent bg-accent-subtle',
        !isSelected && 'hover:bg-surface-raised',
      )}
      onClick={() => onSelect?.(ev.id)}
      onMouseEnter={() => onHover?.(ev.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div className="flex items-start justify-between gap-3 mb-1">
        <div className="flex-1 min-w-0">
          <span className="label-xs">{CATEGORY_LABELS[ev.category] ?? ev.category}</span>
          <p className="text-sm font-medium text-ink-primary mt-0.5">{ev.label}</p>
        </div>
        <SourceBadge source={ev.source} variant="badge" />
      </div>

      <div className="flex items-center gap-2 mb-1">
        <span className="mono text-sm text-accent font-medium">{ev.value}</span>
      </div>

      {ev.importanceNote && (
        <p className="text-xs text-ink-tertiary mb-2 leading-snug">{ev.importanceNote}</p>
      )}

      {/* Reliability: level badge + thin line + % secondary */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-xs font-medium shrink-0 px-1.5 py-0.5 rounded border"
          style={{ color: levelColor, borderColor: levelColor, backgroundColor: `${levelColor}18` }}
        >
          {level}
        </span>
        <div className="h-0.5 flex-1 bg-surface-overlay rounded-full overflow-hidden min-w-[40px]">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${confidencePct}%`, backgroundColor: levelColor }}
          />
        </div>
        <span className="mono text-2xs tabular-nums text-ink-tertiary shrink-0">{confidencePct}%</span>
      </div>

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
        <div className="mt-2 p-3 rounded-lg border border-border bg-surface-overlay/80 animate-fade-in space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xs text-ink-tertiary uppercase tracking-wider">来源类型</span>
            <SourceBadge source={ev.source} variant="badge" />
          </div>
          <p className="text-xs text-ink-secondary leading-relaxed">{ev.basisText}</p>
          {ev.region ? (
            <p className="text-2xs text-ink-tertiary flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm border border-accent/60 inline-block" />
              已在左侧图像中标出对应区域
            </p>
          ) : (
            <p className="text-2xs text-ink-tertiary">该证据无图像区域标注，依据见上方说明。</p>
          )}
        </div>
      )}

      {ev.region && !expanded && (
        <div className="mt-2 flex items-center gap-1.5 text-2xs text-ink-tertiary">
          <span className="w-2 h-2 border border-accent/50 rounded-sm inline-block" />
          <span>已标注图像区域</span>
        </div>
      )}
    </div>
  )
}
