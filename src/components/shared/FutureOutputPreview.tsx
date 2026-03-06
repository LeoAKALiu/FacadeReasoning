import type { FutureOutputs } from '@/data/types'
import { StructuralSketchMock } from './StructuralSketchMock'
import { StructuralParameterTablePreview } from './StructuralParameterTablePreview'
import { ComponentCandidatePreview } from './ComponentCandidatePreview'

interface FutureOutputPreviewProps {
  futureOutputs?: FutureOutputs
}

/**
 * Bundles future-facing deliverables so users can project from parameters to engineering output.
 */
export function FutureOutputPreview({
  futureOutputs,
}: FutureOutputPreviewProps) {
  if (!futureOutputs) return null

  return (
    <div className="space-y-4">
      <div>
        <p className="label-xs mb-1">未来成果物预览</p>
        <h3 className="text-sm font-semibold text-ink-primary">
          当前参数结果将进一步形成的工程表达成果
        </h3>
      </div>

      <StructuralSketchMock preview={futureOutputs.structuralSketchPreview} />
      <StructuralParameterTablePreview rows={futureOutputs.structuralParameterTable} />
      <ComponentCandidatePreview items={futureOutputs.componentCandidates} />

      {futureOutputs.reviewSensitiveItems.length > 0 && (
        <div className="rounded-lg border border-review-muted bg-review-subtle p-4">
          <p className="text-xs font-medium text-review mb-2">关键参数优先复核建议</p>
          <div className="flex flex-wrap gap-2">
            {futureOutputs.reviewSensitiveItems.map((item) => (
              <span
                key={item}
                className="rounded-full border border-review-muted px-2 py-0.5 text-2xs text-review"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
