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

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl font-bold text-ink-primary mb-1">有效参数证据提取</h1>
          <p className="text-sm text-ink-secondary">
            从立面图像中提取可用于推断设计参数的视觉证据，并标注区域依据和来源状态。
          </p>
        </div>
        <Link
          href={`/${projectId}/mapping`}
          className="btn-primary shrink-0"
        >
          下一步：参数映射 →
        </Link>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-2">
        {Object.entries(sourceCounts).map(([source, count]) => (
          <div key={source} className="flex items-center gap-1">
            <SourceBadge source={source as EvidenceSource} variant="inline" />
            <span className="text-xs text-ink-tertiary">× {count}</span>
          </div>
        ))}
        <span className="ml-auto text-xs text-ink-tertiary">
          共 {facadeCase.evidence.length} 条证据
        </span>
      </div>

      <p className="text-sm text-ink-secondary mb-6 pl-0.5 border-l-2 border-accent/50 py-1 px-3">
        {pageConclusion}
      </p>

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

          {/* Case info card */}
          <div className="card p-4 mt-4 space-y-2">
            <p className="label-xs">案例信息</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-ink-tertiary">建筑类型</span>
                <p className="text-ink-primary mt-0.5">{facadeCase.buildingType}</p>
              </div>
              <div>
                <span className="text-ink-tertiary">位置</span>
                <p className="text-ink-primary mt-0.5">{facadeCase.location}</p>
              </div>
              {facadeCase.buildingYear && (
                <div>
                  <span className="text-ink-tertiary">建造年份</span>
                  <p className="text-ink-primary mt-0.5">{facadeCase.buildingYear}</p>
                </div>
              )}
              {facadeCase.floors && (
                <div>
                  <span className="text-ink-tertiary">楼层数</span>
                  <p className="text-ink-primary mt-0.5">{facadeCase.floors} 层</p>
                </div>
              )}
            </div>
            <div className="divider" />
            <p className="text-xs text-ink-secondary leading-relaxed">{facadeCase.summary}</p>
          </div>
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

          {/* Cards */}
          <div className="space-y-3 overflow-y-auto max-h-[700px] pr-1">
            {filteredEvidence.map((ev) => (
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
          </div>
        </div>
      </div>
    </div>
  )
}
