'use client'

import { useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getCaseById } from '@/data/index'
import { ReportCanvas } from '@/components/export/ReportCanvas'
import { ExportArtifactShelf } from '@/components/export/ExportArtifactShelf'
import { ParameterImportanceBadge } from '@/components/shared/ParameterImportanceBadge'
import { UsageRecommendationCard } from '@/components/shared/UsageRecommendationCard'
import { SystemEvolutionRoadmap } from '@/components/shared/SystemEvolutionRoadmap'
import { formatReliability, reliabilityToColor } from '@/lib/utils'

/**
 * Export & report page — one-page report preview with PNG/print export actions.
 */
export default function ExportPage() {
  const params = useParams()
  const projectId = params.projectId as string
  const facadeCase = getCaseById(projectId)
  const printRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [showKeyParams, setShowKeyParams] = useState(false)
  const [showMoreReview, setShowMoreReview] = useState(false)
  const [showScenarioHint, setShowScenarioHint] = useState(false)
  const [showStepsRecap, setShowStepsRecap] = useState(false)
  const [showEvolution, setShowEvolution] = useState(false)

  if (!facadeCase) {
    return (
      <div className="text-center py-20">
        <p className="text-ink-tertiary">未找到项目 {projectId}</p>
      </div>
    )
  }

  const handlePrint = () => {
    window.print()
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const scenario = facadeCase.scenarios.find(
    (s) => s.id === facadeCase.overview.selectedScenarioId,
  ) ?? facadeCase.scenarios[0]

  const overallColor = reliabilityToColor(facadeCase.overview.overallReliability)
  const criticalParameters = scenario.parameters.filter((parameter) => parameter.importanceLevel === 'critical')
  const highPriorityReviewItems = facadeCase.reviewItems.filter((item) => item.priority === 'high')

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl font-bold text-ink-primary">导出与汇报</h1>
          <p className="text-sm text-ink-secondary mt-1">
            预览一页式汇报，导出 PDF 或复制链接分享。
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href={`/${projectId}/overview`} className="btn-secondary text-sm">
            ← 结果总览
          </Link>
          <Link href="/" className="btn-secondary text-sm">
            返回首页
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left sidebar: export actions */}
        <div className="xl:col-span-1 space-y-4 print:hidden">
          {/* Quick stats */}
          <div className="card p-4 space-y-3">
            <h2 className="label-xs">汇报摘要</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-tertiary">项目名称</span>
                <span className="text-ink-primary text-right max-w-[150px] truncate">{facadeCase.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-tertiary">采用方案</span>
                <span className="text-ink-primary">{facadeCase.overview.selectedScenarioId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-tertiary">综合可靠度</span>
                <span className="mono font-bold" style={{ color: overallColor }}>
                  {formatReliability(facadeCase.overview.overallReliability)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-tertiary">设计参数</span>
                <span className="text-ink-primary">{scenario.parameters.length} 项</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-tertiary">待复核项</span>
                <span className="text-review">{facadeCase.reviewItems.length} 项</span>
              </div>
            </div>
          </div>

          <UsageRecommendationCard
            usage={facadeCase.overview.recommendedUsage}
            reason={facadeCase.overview.usageReason}
            compact
          />

          {/* Key params — collapsible */}
          {criticalParameters.length > 0 && (
            <div className="border border-border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setShowKeyParams((v) => !v)}
                className="w-full px-4 py-2 flex items-center justify-between text-left bg-surface-raised/50 hover:bg-surface-raised text-xs text-ink-tertiary"
              >
                <span>关键参数与重要性</span>
                <span>{showKeyParams ? '收起' : '展开'}</span>
              </button>
              {showKeyParams && (
                <div className="p-4 border-t border-border space-y-2">
                  {criticalParameters.slice(0, 5).map((parameter) => (
                    <div key={parameter.id} className="rounded border border-border bg-surface-raised px-3 py-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-ink-primary">{parameter.label}</p>
                        <ParameterImportanceBadge level={parameter.importanceLevel} />
                      </div>
                      <p className="mono text-2xs text-accent mt-0.5">{parameter.value}{parameter.unit ? ` ${parameter.unit}` : ''}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* High priority review — 1–2 default, rest fold */}
          {highPriorityReviewItems.length > 0 && (
            <div className="card p-4">
              <h2 className="label-xs mb-2">高优先复核项</h2>
              <div className="space-y-2">
                {highPriorityReviewItems.slice(0, showMoreReview ? undefined : 2).map((item) => (
                  <div key={item.id} className="rounded border border-review-muted bg-review-subtle px-3 py-2">
                    <p className="text-xs text-review">{item.parameterLabel}</p>
                    <p className="text-2xs text-ink-tertiary mt-0.5">{item.suggestion}</p>
                  </div>
                ))}
                {highPriorityReviewItems.length > 2 && (
                  <button
                    type="button"
                    onClick={() => setShowMoreReview((v) => !v)}
                    className="w-full py-1.5 text-2xs text-ink-tertiary hover:text-ink-secondary"
                  >
                    {showMoreReview ? '收起' : `更多 (${highPriorityReviewItems.length - 2})`}
                  </button>
                )}
              </div>
            </div>
          )}

          <ExportArtifactShelf
            projectId={projectId}
            onExportPdf={handlePrint}
            onExportPng={handlePrint}
            className="card p-4"
          />

          {/* Export buttons */}
          <div className="card p-4 space-y-2">
            <h2 className="label-xs mb-3">导出操作</h2>

            <button
              onClick={handlePrint}
              className="w-full btn-primary flex items-center justify-center gap-2 py-2.5"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="2" y="5" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
                <path d="M4 5V2H10V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M4 9H10M4 11H7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              打印 / 另存 PDF
            </button>

            <button
              onClick={handleCopyLink}
              className="w-full btn-secondary flex items-center justify-center gap-2 py-2.5"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M6 3H3C2.45 3 2 3.45 2 4V11C2 11.55 2.45 12 3 12H10C10.55 12 11 11.55 11 11V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M8 2H12V6M12 2L6 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {copied ? '链接已复制 ✓' : '复制页面链接'}
            </button>
          </div>

          {/* Scenario hint — collapsible */}
          <div className="border border-border rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setShowScenarioHint((v) => !v)}
              className="w-full px-4 py-2 flex items-center justify-between text-left bg-surface-raised/50 hover:bg-surface-raised text-xs text-ink-tertiary"
            >
              <span>其他方案对比</span>
              <span>{showScenarioHint ? '收起' : '展开'}</span>
            </button>
            {showScenarioHint && (
              <div className="p-3 border-t border-border text-xs text-ink-tertiary">
                当前采用方案 {facadeCase.overview.selectedScenarioId}。
                <Link href={`/${projectId}/reasoning`} className="text-accent hover:underline ml-1">前往推理页切换</Link>
              </div>
            )}
          </div>

          {/* Steps recap — collapsible */}
          <div className="border border-border rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setShowStepsRecap((v) => !v)}
              className="w-full px-4 py-2 flex items-center justify-between text-left bg-surface-raised/50 hover:bg-surface-raised text-xs text-ink-tertiary"
            >
              <span>推理流程完成情况</span>
              <span>{showStepsRecap ? '收起' : '展开'}</span>
            </button>
            {showStepsRecap && (
              <div className="p-3 border-t border-border space-y-1 text-2xs text-ink-tertiary">
                {['证据提取', '参数映射', '推理补全', '结果总览'].map((label, i) => (
                  <div key={label} className="flex justify-between">
                    <span>{label}</span>
                    <span>
                      {i === 0 && `${facadeCase.evidence.length} 条`}
                      {i === 1 && `${facadeCase.parameterMappings.length} 个`}
                      {i === 2 && '方案 A/B/C'}
                      {i === 3 && formatReliability(facadeCase.overview.overallReliability)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* System evolution — collapsible */}
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
                <SystemEvolutionRoadmap
                  evolution={facadeCase.overview.evolution}
                  projectId={projectId}
                  layout="stacked"
                />
              </div>
            )}
          </div>
        </div>

        {/* Report preview */}
        <div className="xl:col-span-3">
          <div className="flex items-center justify-between mb-3 print:hidden">
            <h2 className="label-xs">一页式汇报预览</h2>
            <span className="text-2xs text-ink-tertiary bg-surface-raised border border-border px-2 py-1 rounded">
              A4 比例 · 794px 宽
            </span>
          </div>

          <div className="overflow-x-auto">
            <ReportCanvas facadeCase={facadeCase} printRef={printRef} />
          </div>
        </div>
      </div>
    </div>
  )
}
