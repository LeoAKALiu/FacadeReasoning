import type { FutureOutputTableRow } from '@/data/types'
import { ParameterImportanceBadge } from './ParameterImportanceBadge'

interface StructuralParameterTablePreviewProps {
  rows: FutureOutputTableRow[]
}

/**
 * Compact engineering-facing parameter preview table.
 */
export function StructuralParameterTablePreview({
  rows,
}: StructuralParameterTablePreviewProps) {
  return (
    <div className="rounded-lg border border-border bg-surface-raised overflow-hidden">
      <div className="grid grid-cols-[1.1fr_1fr_auto] gap-3 px-4 py-2.5 bg-surface-overlay border-b border-border">
        <span className="label-xs">结构参数表预览</span>
        <span className="label-xs">候选值</span>
        <span className="label-xs text-right">重要性</span>
      </div>
      <div className="divide-y divide-border">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[1.1fr_1fr_auto] gap-3 px-4 py-3 items-center">
            <p className="text-sm text-ink-primary">{row.label}</p>
            <p className="mono text-sm text-accent">{row.value}</p>
            <div className="text-right">
              <ParameterImportanceBadge level={row.importanceLevel} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
