'use client'

import { cn } from '@/lib/utils'
import type { ParameterMapping, Evidence } from '@/data/types'
import { SourceBadge } from '@/components/evidence/SourceBadge'
import { ReliabilityDot } from '@/components/overview/ReliabilityDot'

interface EvidenceBasisDrawerProps {
  mapping: ParameterMapping | null
  allEvidence: Evidence[]
  onClose: () => void
}

/**
 * Right-side drawer panel showing the full evidence basis for a selected
 * parameter mapping. Opens when user clicks on a mapping row.
 */
export function EvidenceBasisDrawer({
  mapping,
  allEvidence,
  onClose,
}: EvidenceBasisDrawerProps) {
  const relatedEvidence = mapping
    ? allEvidence.filter((e) => mapping.evidenceIds.includes(e.id))
    : []

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-30 bg-canvas/60 backdrop-blur-sm transition-opacity',
          mapping ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-14 right-0 bottom-0 z-40 w-96 bg-surface border-l border-border',
          'flex flex-col overflow-hidden transition-transform duration-250',
          mapping ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <p className="text-xs text-ink-tertiary mb-0.5">参数映射依据</p>
            <h3 className="text-sm font-semibold text-ink-primary">
              {mapping?.designParam.label ?? '—'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-ink-tertiary hover:text-ink-primary hover:bg-surface-raised transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {mapping && (
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Mapping summary */}
            <section>
              <div className="flex items-start gap-3 p-3 bg-surface-raised rounded-lg border border-border">
                <div className="flex-1">
                  <p className="text-2xs text-ink-tertiary mb-1 uppercase tracking-wider">有效参数</p>
                  <p className="text-sm font-medium text-ink-primary">{mapping.effectiveParam.label}</p>
                  <p className="mono text-xs text-accent mt-0.5">{mapping.effectiveParam.value}</p>
                </div>
                <div className="self-center text-ink-tertiary">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10H16M12 6L16 10L12 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-2xs text-ink-tertiary mb-1 uppercase tracking-wider">设计参数</p>
                  <p className="text-sm font-medium text-ink-primary">{mapping.designParam.label}</p>
                  <span className="inline-block text-2xs text-infer bg-infer-subtle border border-infer-muted px-1.5 py-0.5 rounded mt-0.5">
                    {mapping.designParam.category}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-ink-tertiary">映射置信度</span>
                <ReliabilityDot value={mapping.confidence} variant="pill" />
              </div>
            </section>

            {/* Mapping reason */}
            <section>
              <h4 className="label-xs mb-2">映射逻辑说明</h4>
              <div className="p-3 bg-surface-raised rounded-lg border border-border text-sm text-ink-secondary leading-relaxed">
                {mapping.mappingReason}
              </div>
            </section>

            {/* Related evidence */}
            <section>
              <h4 className="label-xs mb-3">支撑证据（{relatedEvidence.length} 条）</h4>
              <div className="space-y-3">
                {relatedEvidence.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 bg-surface-raised rounded-lg border border-border"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-medium text-ink-primary">{ev.label}</p>
                      <SourceBadge source={ev.source} variant="badge" />
                    </div>
                    <p className="mono text-xs text-accent mb-2">{ev.value}</p>

                    {/* Confidence */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-1 flex-1 bg-surface-overlay rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${ev.confidence * 100}%`,
                            backgroundColor: ev.confidence >= 0.8 ? '#22C55E' : ev.confidence >= 0.6 ? '#EAB308' : '#F97316',
                          }}
                        />
                      </div>
                      <span className="mono text-2xs text-ink-tertiary">
                        {Math.round(ev.confidence * 100)}%
                      </span>
                    </div>

                    <p className="text-xs text-ink-tertiary leading-relaxed">{ev.basisText}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </>
  )
}
