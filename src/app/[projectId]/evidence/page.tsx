'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getCaseById } from '@/data/index'
import { EvidenceImagePanel } from '@/components/evidence/EvidenceImagePanel'
import { EvidenceDetailStrip } from '@/components/evidence/EvidenceDetailStrip'
import { EvidenceCard } from '@/components/evidence/EvidenceCard'
import { SourceBadge } from '@/components/evidence/SourceBadge'
import type { EvidenceSource, Evidence } from '@/data/types'

const SOURCE_FILTERS: { source: EvidenceSource | 'all'; label: string }[] = [
  { source: 'all', label: '全部' },
  { source: 'direct_observation', label: '直接观测' },
  { source: 'rule_inference', label: '规则推断' },
  { source: 'ai_completion', label: 'AI 补全' },
  { source: 'pending_review', label: '待复核' },
]

function getPageConclusion(evidence: Evidence[]): string {
  const total = evidence.length
  if (total === 0) return '当前无证据数据。'
  const obs = evidence.filter((e) => e.source === 'direct_observation').length
  const ai = evidence.filter((e) => e.source === 'ai_completion').length
  const review = evidence.filter((e) => e.source === 'pending_review').length
  if (obs / total >= 0.65 && review === 0) {
    return '当前案例以直接观测证据为主，整体证据基础较强。'
  }
  if (ai > 0 || review > 0) {
    if (review >= 2 || ai >= 3) {
      return '当前案例存在少量 AI 补全与待复核项，建议结合人工复核。'
    }
    return '当前案例证据结构较均衡，可支撑后续参数映射与方案推理。'
  }
  return '当前案例证据结构较均衡，可支撑后续参数映射与方案推理。'
}

/**
 * Evidence extraction page — image viewer + evidence cards with image linkage.
 */
export default function EvidencePage() {
  const params = useParams()
  const projectId = params.projectId as string
  const facadeCase = getCaseById(projectId)

  const [selectedFilter, setSelectedFilter] = useState<EvidenceSource | 'all'>('all')
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null)
  const [hoveredEvidenceId, setHoveredEvidenceId] = useState<string | null>(null)
  const [showMoreEvidence, setShowMoreEvidence] = useState(false)
  const [caseInfoOpen, setCaseInfoOpen] = useState(false)
  const highlightedEvidenceId = selectedEvidenceId ?? hoveredEvidenceId

  if (!facadeCase) {
    return (
      <div className="text-center py-20">
        <p className="text-ink-tertiary">未找到项目 {projectId}</p>
        <Link href="/" className="text-accent hover:underline text-sm mt-2 inline-block">
          返回首页
        </Link>
      </div>
    )
  }

  const filteredEvidence =
    selectedFilter === 'all'
      ? facadeCase.evidence
      : facadeCase.evidence.filter((e) => e.source === selectedFilter)

  const sourceCounts = facadeCase.evidence.reduce(
    (acc, e) => {
      acc[e.source] = (acc[e.source] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const pageConclusion = getPageConclusion(facadeCase.evidence)

  const keyEvidenceCount = 4
  const keyEvidence = facadeCase.evidence.slice(0, keyEvidenceCount)
  const restEvidence = facadeCase.evidence.slice(keyEvidenceCount)
  const displayEvidence = showMoreEvidence ? filteredEvidence : filteredEvidence.slice(0, keyEvidenceCount)
  const hasMoreEvidence = filteredEvidence.length > keyEvidenceCount

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h1 className="text-xl font-bold text-ink-primary">有效参数证据提取</h1>
          <p className="text-sm text-ink-secondary mt-1 pl-0.5 border-l-2 border-accent/50 py-0.5 px-3">
            {pageConclusion}
          </p>
        </div>
        <Link
          href={`/${projectId}/mapping`}
          className="btn-primary shrink-0"
        >
          下一步：参数映射 →
        </Link>
      </div>

      <div className="flex items-center gap-3 flex-wrap mb-4 text-xs text-ink-tertiary">
        <span className="mono font-medium text-ink-secondary">{facadeCase.evidence.length} 条证据</span>
        {Object.entries(sourceCounts).slice(0, 3).map(([source, count]) => (
          <div key={source} className="flex items-center gap-1">
            <SourceBadge source={source as EvidenceSource} variant="inline" />
            <span>{count}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <EvidenceImagePanel
            images={facadeCase.images}
            evidenceItems={facadeCase.evidence}
            highlightedEvidenceId={highlightedEvidenceId}
            runScanAnimation
          />
          <EvidenceDetailStrip
            projectId={projectId}
            slots={facadeCase.evidence.slice(0, 4).map((ev, i) => ({
              evidenceId: ev.id,
              imageKey: `detail-${String(i + 1).padStart(2, '0')}.png`,
              caption: ev.label,
            }))}
            highlightedEvidenceId={highlightedEvidenceId}
            onSlotHover={setHoveredEvidenceId}
            className="mt-4"
          />
        </div>

        {/* Right: Evidence list */}
        <div className="flex flex-col gap-4">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-surface-raised rounded-lg p-1 self-start flex-wrap">
            {SOURCE_FILTERS.map((f) => {
              const count =
                f.source === 'all'
                  ? facadeCase.evidence.length
                  : (sourceCounts[f.source] ?? 0)
              if (f.source !== 'all' && count === 0) return null
              return (
                <button
                  key={f.source}
                  onClick={() => setSelectedFilter(f.source)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5
                    ${selectedFilter === f.source
                      ? 'bg-surface-overlay text-ink-primary shadow-sm'
                      : 'text-ink-tertiary hover:text-ink-secondary'
                    }`}
                >
                  {f.label}
                  <span className="text-2xs opacity-70">{count}</span>
                </button>
              )
            })}
          </div>

          {/* Key evidence (default 4) + more fold */}
          <div className="space-y-3">
            {displayEvidence.map((ev) => (
              <EvidenceCard
                key={ev.id}
                evidence={ev}
                isSelected={selectedEvidenceId === ev.id}
                onSelect={(id) =>
                  setSelectedEvidenceId(selectedEvidenceId === id ? null : id)
                }
                onHover={setHoveredEvidenceId}
              />
            ))}
            {hasMoreEvidence && (
              <button
                type="button"
                onClick={() => setShowMoreEvidence((v) => !v)}
                className="w-full py-2 text-xs text-ink-tertiary hover:text-ink-secondary border border-border rounded-lg hover:bg-surface-raised transition-colors"
              >
                {showMoreEvidence ? '收起' : `更多证据 (${filteredEvidence.length - keyEvidenceCount})`}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Case info — collapsible */}
      <div className="mt-6 border border-border rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setCaseInfoOpen((o) => !o)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-left bg-surface-raised/50 hover:bg-surface-raised text-sm"
        >
          <span className="text-ink-secondary font-medium">案例信息</span>
          <span className="text-2xs text-ink-tertiary">{caseInfoOpen ? '收起' : '展开'}</span>
        </button>
        {caseInfoOpen && (
          <div className="p-4 space-y-2 border-t border-border">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-ink-tertiary">建筑类型</span><p className="text-ink-primary mt-0.5">{facadeCase.buildingType}</p></div>
              <div><span className="text-ink-tertiary">位置</span><p className="text-ink-primary mt-0.5">{facadeCase.location}</p></div>
              {facadeCase.buildingYear && <div><span className="text-ink-tertiary">建造年份</span><p className="text-ink-primary mt-0.5">{facadeCase.buildingYear}</p></div>}
              {facadeCase.floors && <div><span className="text-ink-tertiary">楼层数</span><p className="text-ink-primary mt-0.5">{facadeCase.floors} 层</p></div>}
            </div>
            <p className="text-xs text-ink-tertiary leading-relaxed pt-1">{facadeCase.summary}</p>
          </div>
        )}
      </div>
    </div>
  )
}
