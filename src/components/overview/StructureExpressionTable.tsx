'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { StructuralNode } from '@/data/types'
import { SourceBadge } from '@/components/evidence/SourceBadge'
import { ReliabilityDot } from './ReliabilityDot'

interface StructureExpressionTableProps {
  nodes: StructuralNode[]
  /** Starts all nodes expanded if true. */
  defaultExpanded?: boolean
}

/**
 * Hierarchical tree-table showing the structural expression of the facade.
 * Each row has a reliability dot, source badge, and expandable children.
 */
export function StructureExpressionTable({
  nodes,
  defaultExpanded = true,
}: StructureExpressionTableProps) {
  return (
    <div className="card overflow-hidden">
      {/* Column headers */}
      <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-2.5 bg-surface-raised border-b border-border">
        <span className="label-xs w-4" />
        <span className="label-xs">参数 / 值</span>
        <span className="label-xs text-right">来源</span>
        <span className="label-xs text-right w-16">可靠度</span>
      </div>

      <div className="divide-y divide-border">
        {nodes.map((node) => (
          <NodeRow key={node.id} node={node} depth={0} defaultExpanded={defaultExpanded} />
        ))}
      </div>
    </div>
  )
}

interface NodeRowProps {
  node: StructuralNode
  depth: number
  defaultExpanded: boolean
}

function NodeRow({ node, depth, defaultExpanded }: NodeRowProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const hasChildren = node.children && node.children.length > 0

  return (
    <>
      <div
        className={cn(
          'grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-3 items-center',
          hasChildren && 'cursor-pointer hover:bg-surface-raised transition-colors',
          depth === 0 && 'bg-surface-raised/50',
        )}
        style={{ paddingLeft: `${16 + depth * 20}px` }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {/* Expand/leaf indicator */}
        <div className="w-4 flex justify-center">
          {hasChildren ? (
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              className={cn('text-ink-tertiary transition-transform', expanded && 'rotate-90')}
            >
              <path d="M3 2L7 5L3 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <ReliabilityDot value={node.reliability} variant="dot" />
          )}
        </div>

        {/* Label + value */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                'text-sm',
                depth === 0 ? 'font-semibold text-ink-primary' : 'text-ink-primary',
              )}
            >
              {node.label}
            </span>
            {depth > 0 && hasChildren === false && (
              <span className="mono text-sm text-accent">{node.value}</span>
            )}
          </div>
          {depth === 0 && (
            <p className="mono text-xs text-accent mt-0.5">{node.value}</p>
          )}
        </div>

        {/* Source */}
        <SourceBadge source={node.source} variant="badge" />

        {/* Reliability */}
        <ReliabilityDot value={node.reliability} variant="pill" className="justify-end" />
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div>
          {node.children!.map((child) => (
            <NodeRow key={child.id} node={child} depth={depth + 1} defaultExpanded={defaultExpanded} />
          ))}
        </div>
      )}
    </>
  )
}
