import type { FutureOutputs } from '@/data/types'
import { StructuralSketchMock } from './StructuralSketchMock'
import { StructuralParameterTablePreview } from './StructuralParameterTablePreview'
import { ComponentCandidatePreview } from './ComponentCandidatePreview'
import { FutureOutputGallery } from './FutureOutputGallery'

interface FutureOutputPreviewProps {
  futureOutputs?: FutureOutputs
  /** When set, shows asset-based gallery (structure sketch, param table, component candidates). */
  projectId?: string
}

/**
 * Bundles future-facing deliverables so users can project from parameters to engineering output.
 */
export function FutureOutputPreview({
  futureOutputs,
  projectId,
}: FutureOutputPreviewProps) {
  if (!futureOutputs) return null

  return (
    <div className="space-y-3">
      <div>
        <p className="label-xs mb-0.5">未来成果物预览</p>
        <p className="text-xs text-ink-primary">结构草图、参数表、构件候选</p>
      </div>

      {projectId && (
        <FutureOutputGallery
          projectId={projectId}
          includeComponentCandidates
          className="mb-3"
        />
      )}

      <StructuralSketchMock preview={futureOutputs.structuralSketchPreview} />
      <StructuralParameterTablePreview rows={futureOutputs.structuralParameterTable} />
      <ComponentCandidatePreview items={futureOutputs.componentCandidates} />

      {futureOutputs.reviewSensitiveItems.length > 0 && (
        <details className="rounded-lg border border-review-muted bg-review-subtle overflow-hidden group">
          <summary className="px-3 py-2 text-2xs font-medium text-review cursor-pointer list-none">
            关键参数优先复核 ({futureOutputs.reviewSensitiveItems.length})
          </summary>
          <div className="px-3 pb-2 pt-0 flex flex-wrap gap-2 border-t border-review-muted">
            {futureOutputs.reviewSensitiveItems.map((item) => (
              <span key={item} className="rounded-full border border-review-muted px-2 py-0.5 text-2xs text-review">
                {item}
              </span>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}
