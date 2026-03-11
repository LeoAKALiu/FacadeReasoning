'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getCaseById } from '@/data/index'
import { StructureExpressionTable } from '@/components/overview/StructureExpressionTable'
import { ReviewItemCard } from '@/components/overview/ReviewItemCard'
import { ReliabilityDot } from '@/components/overview/ReliabilityDot'
import { SourceBadge } from '@/components/evidence/SourceBadge'
import { ParameterImportanceBadge } from '@/components/shared/ParameterImportanceBadge'
import { UsageRecommendationCard } from '@/components/shared/UsageRecommendationCard'
import { EngineeringTranslationFlow } from '@/components/shared/EngineeringTranslationFlow'
import { FutureOutputPreview } from '@/components/shared/FutureOutputPreview'
import { SystemEvolutionRoadmap } from '@/components/shared/SystemEvolutionRoadmap'
import { formatReliability, reliabilityToColor } from '@/lib/utils'

/**
 * Results overview page — structural expression tree with reliability badges
 * and list of items requiring human review.
 */
export default function OverviewPage() {
  const params = useParams()
  const projectId = params.projectId as string
  const facadeCase = getCaseById(projectId)
  const [showImportanceDetail, setShowImportanceDetail] = useState(false)
  const [showMoreReview, setShowMoreReview] = useState(false)
  const [showLegend, setShowLegend] = useState(false)
  const [showEvolution, setShowEvolution] = useState(false)

  if (!facadeCase) {
    return (
      <div className="text-center py-20">
        <p className="text-ink-tertiary">未找到项目 {projectId}</p>
      </div>
    )
  }

  const { overview, reviewItems } = facadeCase
  const selectedScenario = facadeCase.scenarios.find((s) => s.id === overview.selectedScenarioId)
  const overallColor = reliabilityToColor(overview.overallReliability)

  const totalParams = selectedScenario?.parameters.length ?? 0
  const pendingCount = reviewItems.length
  const highPriorityCount = reviewItems.filter((r) => r.priority === 'high').length
  const groupedByImportance = {
    critical: selectedScenario?.parameters.filter((parameter) => parameter.importanceLevel === 'critical') ?? [],
    important: selectedScenario?.parameters.filter((parameter) => parameter.importanceLevel === 'important') ?? [],
    detail: selectedScenario?.parameters.filter((parameter) => parameter.importanceLevel === 'detail') ?? [],
  }
  const highPriorityReview = reviewItems.filter((r) => r.priority === 'high')
  const restReview = reviewItems.filter((r) => r.priority !== 'high')

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl font-bold text-ink-primary">带可靠度标识的结构表达结果</h1>
          <p className="text-sm text-ink-secondary mt-1 pl-0.5 border-l-2 border-accent/50 py-0.5 px-3">
            当前结果已达可引用程度；{highPriorityCount > 0 ? `${highPriorityCount} 项高优先须复核。` : '待复核项已标注。'}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href={`/${projectId}/reasoning`} className="btn-secondary text-sm">
            ← 推理补全
          </Link>
          <Link href={`/${projectId}/export`} className="btn-primary text-sm">
            下一步：导出汇报 →
          </Link>
        </div>
      </div>

      {/* Overall reliability hero card */}
      <div className="card p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black"
            style={{
              backgroundColor: `${overallColor}15`,
              border: `2px solid ${overallColor}40`,
              color: overallColor,
            }}
          >
            <span className="mono text-xl">{formatReliability(overview.overallReliability)}</span>
          </div>
          <div>
            <p className="text-xs text-ink-tertiary mb-0.5">综合可靠度</p>
            <p className="text-sm font-semibold text-ink-primary">
              {overview.overallReliability >= 0.85
                ? '高置信度 — 可直接引用'
                : overview.overallReliability >= 0.65
                ? '中等置信度 — 建议人工抽查'
                : '低置信度 — 需人工全面核验'}
            </p>
            <p className="text-xs text-ink-tertiary mt-0.5">
              采用方案 {overview.selectedScenarioId}：{selectedScenario?.label}
            </p>
          </div>
        </div>

        <div className="sm:ml-auto grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="mono text-2xl font-bold text-ink-primary">{totalParams}</p>
            <p className="text-2xs text-ink-tertiary mt-0.5">设计参数</p>
          </div>
          <div>
            <p className="mono text-2xl font-bold text-review">{pendingCount}</p>
            <p className="text-2xs text-ink-tertiary mt-0.5">待复核项</p>
          </div>
          <div>
            <p className="mono text-2xl font-bold" style={{ color: '#EF4444' }}>{highPriorityCount}</p>
            <p className="text-2xs text-ink-tertiary mt-0.5">高优先复核</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <UsageRecommendationCard
          usage={overview.recommendedUsage}
          reason={overview.usageReason}
          compact
        />
      </div>

      {/* Main two-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <p className="text-2xs text-ink-tertiary">
            当前结果将生成结构草图、参数表与构件表达。
          </p>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="section-heading">结构表达</h2>
              <div className="flex items-center gap-2 text-2xs text-ink-tertiary">
                <span>可靠度</span>
                <div className="h-1.5 w-12 rounded-full" style={{ background: 'linear-gradient(to right, #EF4444, #EAB308, #22C55E)' }} />
              </div>
            </div>
            <StructureExpressionTable
              nodes={overview.structuralNodes}
              defaultExpanded={false}
            />
          </div>

          <FutureOutputPreview futureOutputs={overview.futureOutputs} projectId={projectId} />
        </div>

        <div className="space-y-6">
          {/* Parameter importance — summary by default, detail fold */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="label-xs">参数重要性分级</h2>
              <button
                type="button"
                onClick={() => setShowImportanceDetail((v) => !v)}
                className="text-2xs text-ink-tertiary hover:text-ink-secondary"
              >
                {showImportanceDetail ? '收起' : '展开'}
              </button>
            </div>
            <div className="space-y-3">
              {([
                ['critical', groupedByImportance.critical],
                ['important', groupedByImportance.important],
                ['detail', groupedByImportance.detail],
              ] as const).map(([level, items]) => {
                const total = groupedByImportance.critical.length + groupedByImportance.important.length + groupedByImportance.detail.length
                const pct = total > 0 ? Math.min(100, (items.length / total) * 100) : 0
                const barColor = level === 'critical' ? '#EF4444' : level === 'important' ? '#3B82F6' : '#64748B'
                return (
                  <div key={level}>
                    <div className="flex items-center justify-between gap-2">
                      <ParameterImportanceBadge level={level} />
                      <div className="flex-1 h-1 rounded-full overflow-hidden bg-surface-overlay min-w-[60px]">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                      </div>
                      <span className="text-2xs text-ink-tertiary shrink-0">{items.length} 项</span>
                    </div>
                    {showImportanceDetail && items.length > 0 && (
                      <div className="space-y-1.5 mt-2 pl-1">
                        {items.slice(0, 4).map((parameter) => (
                          <div key={parameter.id} className="rounded border border-border bg-surface-raised px-2 py-1.5">
                            <p className="text-2xs text-ink-primary">{parameter.label}</p>
                            {parameter.importanceNote && <p className="text-2xs text-ink-tertiary mt-0.5">{parameter.importanceNote}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Review items — high priority first, rest fold */}
          {reviewItems.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="section-heading">待人工复核项</h2>
                <span className="text-xs text-review bg-review-subtle border border-review-muted px-2 py-0.5 rounded-full">
                  {reviewItems.length} 项
                </span>
              </div>
              <div className="space-y-2">
                {highPriorityReview.map((item, i) => {
                  const evidenceIndex = item.relatedEvidenceIds?.length ? facadeCase.evidence.findIndex((e) => e.id === item.relatedEvidenceIds[0]) : -1
                  const detailSlot = evidenceIndex >= 0 && evidenceIndex < 4 ? evidenceIndex + 1 : null
                  return (
                    <ReviewItemCard key={item.id} item={item} index={i + 1} projectId={projectId} detailSlot={detailSlot} />
                  )
                })}
                {restReview.length > 0 && (
                  <>
                    {!showMoreReview ? (
                      <button
                        type="button"
                        onClick={() => setShowMoreReview(true)}
                        className="w-full py-2 text-2xs text-ink-tertiary hover:text-ink-secondary border border-border rounded-lg"
                      >
                        更多复核项 ({restReview.length})
                      </button>
                    ) : (
                      <>
                        {restReview.map((item, i) => {
                          const evidenceIndex = item.relatedEvidenceIds?.length ? facadeCase.evidence.findIndex((e) => e.id === item.relatedEvidenceIds[0]) : -1
                          const detailSlot = evidenceIndex >= 0 && evidenceIndex < 4 ? evidenceIndex + 1 : null
                          return (
                            <ReviewItemCard key={item.id} item={item} index={highPriorityReview.length + i + 1} projectId={projectId} detailSlot={detailSlot} />
                          )
                        })}
                        <button type="button" onClick={() => setShowMoreReview(false)} className="w-full py-1.5 text-2xs text-ink-tertiary">收起</button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Legend — collapsible */}
          <div className="border border-border rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setShowLegend((v) => !v)}
              className="w-full px-4 py-2 flex items-center justify-between text-left bg-surface-raised/50 hover:bg-surface-raised text-xs text-ink-tertiary"
            >
              <span>可靠度与来源图例</span>
              <span>{showLegend ? '收起' : '展开'}</span>
            </button>
            {showLegend && (
              <div className="p-4 border-t border-border space-y-3">
                <div className="flex flex-wrap gap-2 text-2xs">
                  {([{ range: '≥85%', color: '#22C55E' }, { range: '70–84%', color: '#84CC16' }, { range: '50–69%', color: '#EAB308' }, { range: '<50%', color: '#EF4444' }] as const).map((item) => (
                    <span key={item.range} className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      {item.range}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(['direct_observation', 'rule_inference', 'ai_completion', 'pending_review'] as const).map((s) => (
                    <SourceBadge key={s} source={s} variant="inline" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* System evolution — bottom, collapsible */}
          <div className="border border-border rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setShowEvolution((v) => !v)}
              className="w-full px-4 py-2 flex items-center justify-between text-left bg-surface-raised/50 hover:bg-surface-raised text-xs text-ink-tertiary"
            >
              <span>系统演进路径</span>
              <span>{showEvolution ? '收起' : '展开'}</span>
            </button>
            {showEvolution && (
              <div className="border-t border-border">
                <SystemEvolutionRoadmap evolution={overview.evolution} projectId={projectId} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
