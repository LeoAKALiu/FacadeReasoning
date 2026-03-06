'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { DesignParameter } from '@/data/types'
import { SourceBadge } from '@/components/evidence/SourceBadge'
import { ReliabilityDot } from '@/components/overview/ReliabilityDot'
import { ParameterImportanceBadge } from '@/components/shared/ParameterImportanceBadge'

interface ParameterTableProps {
  parameters: DesignParameter[]
  /** If true, groups rows by category. */
  grouped?: boolean
}

/**
 * Table of design parameters with source badges, reliability dots, and
 * expandable basis/constraint details. Used in the reasoning step.
 */
export function ParameterTable({ parameters, grouped = true }: ParameterTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const importanceOrder = { critical: 0, important: 1, detail: 2 } as const

  const sortedParameters = [...parameters].sort((a, b) => {
    const aRank = a.importanceLevel ? importanceOrder[a.importanceLevel] : 99
    const bRank = b.importanceLevel ? importanceOrder[b.importanceLevel] : 99
    if (aRank !== bRank) return aRank - bRank
    return a.label.localeCompare(b.label, 'zh-CN')
  })

  const categories = grouped
    ? [...new Set(sortedParameters.map((p) => p.category))]
    : []

  const renderRow = (p: DesignParameter) => {
    const isExpanded = expandedId === p.id
    return (
      <div key={p.id}>
        <div
          className={cn(
            'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors',
            isExpanded ? 'bg-surface-raised' : 'hover:bg-surface-raised',
          )}
          onClick={() => setExpandedId(isExpanded ? null : p.id)}
        >
          {/* Source dot */}
          <SourceBadge source={p.source} variant="dot" className="shrink-0" />

          {/* Label */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm text-ink-primary">{p.label}</p>
              <ParameterImportanceBadge level={p.importanceLevel} />
            </div>
            {p.importanceNote && (
              <p className="text-2xs text-ink-tertiary mt-0.5 leading-relaxed">
                {p.importanceNote}
              </p>
            )}
            {p.constraintApplied && (
              <p className="text-2xs text-ink-tertiary mt-0.5 flex items-center gap-1">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <rect x="1" y="1" width="6" height="6" rx="1" stroke="#6B7280" strokeWidth="1" />
                  <path d="M2.5 4H5.5M4 2.5V5.5" stroke="#6B7280" strokeWidth="1" strokeLinecap="round" />
                </svg>
                {p.constraintApplied}
              </p>
            )}
          </div>

          {/* Value */}
          <span className="mono text-sm text-ink-primary font-medium">
            {p.value}
            {p.unit && <span className="text-ink-tertiary text-xs ml-0.5">{p.unit}</span>}
          </span>

          {/* Reliability */}
          <ReliabilityDot value={p.reliability} variant="pill" />

          {/* Expand chevron */}
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            className={cn('shrink-0 text-ink-tertiary transition-transform', isExpanded && 'rotate-180')}
          >
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Expanded detail */}
        {isExpanded && (
          <div className="px-4 pb-3 bg-surface-raised border-b border-border animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <SourceBadge source={p.source} variant="badge" />
            </div>
            <p className="text-xs text-ink-secondary leading-relaxed">{p.basisText}</p>
            {p.importanceNote && (
              <div className="mt-2 flex items-start gap-1.5 text-xs text-ink-tertiary">
                <span className="text-accent font-medium shrink-0">工程影响：</span>
                <span>{p.importanceNote}</span>
              </div>
            )}
            {p.constraintApplied && (
              <div className="mt-2 flex items-start gap-1.5 text-xs text-ink-tertiary">
                <span className="text-infer font-medium shrink-0">约束：</span>
                <span>{p.constraintApplied}</span>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  if (!grouped) {
    return (
      <div className="card overflow-hidden divide-y divide-border">
        {sortedParameters.map(renderRow)}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {categories.map((cat) => {
        const catParams = sortedParameters.filter((p) => p.category === cat)
        return (
          <div key={cat} className="card overflow-hidden">
            <div className="px-4 py-2.5 bg-surface-raised border-b border-border">
              <span className="label-xs">{cat}</span>
              <span className="ml-2 text-2xs text-ink-tertiary">({catParams.length} 项)</span>
            </div>
            <div className="divide-y divide-border">
              {catParams.map(renderRow)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
