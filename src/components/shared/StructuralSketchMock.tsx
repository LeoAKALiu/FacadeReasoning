import type { StructuralSketchPreview } from '@/data/types'

interface StructuralSketchMockProps {
  preview: StructuralSketchPreview
}

/**
 * Lightweight wireframe sketch hinting how parameters translate into structural expression.
 */
export function StructuralSketchMock({ preview }: StructuralSketchMockProps) {
  return (
    <div className="rounded-lg border border-border bg-surface-raised p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-sm font-semibold text-ink-primary">{preview.title}</p>
          <p className="text-xs text-ink-tertiary mt-1 leading-relaxed">{preview.summary}</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-canvas/60 p-3 mb-3">
        <svg viewBox="0 0 320 180" className="w-full h-auto">
          <rect x="20" y="22" width="280" height="136" rx="6" fill="none" stroke="#475569" strokeWidth="1.5" />
          <rect x="52" y="44" width="216" height="92" rx="4" fill="none" stroke="#6366F1" strokeDasharray="4 3" />
          <line x1="88" y1="44" x2="88" y2="136" stroke="#64748B" strokeWidth="1" />
          <line x1="136" y1="44" x2="136" y2="136" stroke="#64748B" strokeWidth="1" />
          <line x1="184" y1="44" x2="184" y2="136" stroke="#64748B" strokeWidth="1" />
          <line x1="232" y1="44" x2="232" y2="136" stroke="#64748B" strokeWidth="1" />
          <line x1="52" y1="72" x2="268" y2="72" stroke="#64748B" strokeWidth="1" />
          <line x1="52" y1="102" x2="268" y2="102" stroke="#64748B" strokeWidth="1" />
          {[88, 136, 184, 232].map((x) => (
            <circle key={x} cx={x} cy={72} r="4" fill="#22C55E" fillOpacity="0.9" />
          ))}
          {[88, 136, 184, 232].map((x) => (
            <circle key={`${x}-b`} cx={x} cy={102} r="4" fill="#22C55E" fillOpacity="0.9" />
          ))}
          <path d="M40 148H280" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="5 3" />
          <text x="26" y="18" fill="#94A3B8" fontSize="10">Perimeter</text>
          <text x="58" y="40" fill="#A5B4FC" fontSize="10">Grid / Standard Floor</text>
          <text x="42" y="162" fill="#F59E0B" fontSize="10">Podium / Review Boundary</text>
        </svg>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <p className="text-ink-secondary mb-1">轴线/模数</p>
          <div className="space-y-1">
            {preview.axisNotes.map((note) => (
              <p key={note} className="text-ink-tertiary leading-relaxed">{note}</p>
            ))}
          </div>
        </div>
        <div>
          <p className="text-ink-secondary mb-1">标准层组织</p>
          <p className="text-ink-tertiary leading-relaxed">{preview.organizationNote}</p>
        </div>
        <div>
          <p className="text-ink-secondary mb-1">外围护表达</p>
          <p className="text-ink-tertiary leading-relaxed">{preview.envelopeNote}</p>
        </div>
      </div>
    </div>
  )
}
