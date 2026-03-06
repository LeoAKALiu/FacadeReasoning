'use client'

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

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-ink-primary mb-1">带可靠度标识的结构表达结果</h1>
          <p className="text-sm text-ink-secondary">
            以层级结构展示最终设计参数认知结果，每项参数附带来源状态与可靠度标识。
            高亮标注待人工复核的参数。
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

      <div className="mb-6">
        <UsageRecommendationCard
          usage={overview.recommendedUsage}
          reason={overview.usageReason}
        />
      </div>

      {/* Main two-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Structural expression table (2/3 width) */}
        <div className="xl:col-span-2 space-y-6">
          <EngineeringTranslationFlow bridgeNote="当前结果不会停留在参数树层，而是会继续生成结构草图、结构参数表与构件级表达。" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-heading">结构表达</h2>
              <div className="flex items-center gap-3 text-xs text-ink-tertiary">
                <span>可靠度</span>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-16 rounded-full" style={{ background: 'linear-gradient(to right, #EF4444, #EAB308, #22C55E)' }} />
                  <span>低 → 高</span>
                </div>
              </div>
            </div>
            <StructureExpressionTable
              nodes={overview.structuralNodes}
              defaultExpanded
            />
          </div>

          <FutureOutputPreview futureOutputs={overview.futureOutputs} />
        </div>

        {/* Right column: review items + source legend */}
        <div className="space-y-6">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="label-xs">参数重要性分级</h2>
              <span className="text-2xs text-ink-tertiary">可靠度与重要性分开表达</span>
            </div>
            <div className="space-y-4">
              {([
                ['critical', groupedByImportance.critical],
                ['important', groupedByImportance.important],
                ['detail', groupedByImportance.detail],
              ] as const).map(([level, items]) => (
                <div key={level}>
                  <div className="flex items-center justify-between mb-2">
                    <ParameterImportanceBadge level={level} />
                    <span className="text-2xs text-ink-tertiary">{items.length} 项</span>
                  </div>
                  <div className="space-y-2">
                    {items.slice(0, 4).map((parameter) => (
                      <div key={parameter.id} className="rounded-md border border-border bg-surface-raised px-3 py-2">
                        <p className="text-xs text-ink-primary">{parameter.label}</p>
                        <p className="text-2xs text-ink-tertiary mt-1 leading-relaxed">
                          {parameter.importanceNote}
                        </p>
                      </div>
                    ))}
                    {items.length === 0 && (
                      <p className="text-2xs text-ink-tertiary">暂无该级别参数</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Source legend */}
          <div className="card p-4">
            <h2 className="label-xs mb-3">可靠度颜色说明</h2>
            <div className="space-y-2">
              {(
                [
                  { range: '≥ 85%', color: '#22C55E', label: '高置信度' },
                  { range: '70–84%', color: '#84CC16', label: '较高置信度' },
                  { range: '50–69%', color: '#EAB308', label: '中等置信度' },
                  { range: '35–49%', color: '#F97316', label: '偏低置信度' },
                  { range: '< 35%', color: '#EF4444', label: '低置信度' },
                ] as const
              ).map((item) => (
                <div key={item.range} className="flex items-center gap-2 text-xs">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="mono text-ink-tertiary w-16">{item.range}</span>
                  <span className="text-ink-secondary">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="divider mt-3 mb-3" />
            <h2 className="label-xs mb-3">参数来源图例</h2>
            <div className="space-y-1.5">
              {(
                [
                  'direct_observation',
                  'rule_inference',
                  'ai_completion',
                  'pending_review',
                ] as const
              ).map((s) => (
                <SourceBadge key={s} source={s} variant="inline" />
              ))}
            </div>
          </div>

          <SystemEvolutionRoadmap evolution={overview.evolution} />

          {/* Review items */}
          {reviewItems.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="section-heading">待人工复核项</h2>
                <span className="text-xs text-review bg-review-subtle border border-review-muted px-2 py-0.5 rounded-full">
                  {reviewItems.length} 项
                </span>
              </div>
              <div className="space-y-3">
                {reviewItems.map((item, i) => (
                  <ReviewItemCard key={item.id} item={item} index={i + 1} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
