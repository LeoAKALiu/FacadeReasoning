'use client'

import { useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getCaseById } from '@/data/index'
import { ReportCanvas } from '@/components/export/ReportCanvas'
import { formatReliability, reliabilityToColor } from '@/lib/utils'

/**
 * Export & report page — one-page report preview with PNG/print export actions.
 */
export default function ExportPage() {
  const params = useParams()
  const projectId = params.projectId as string
  const facadeCase = getCaseById(projectId)
  const printRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)
  const [copied, setCopied] = useState(false)

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

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-ink-primary mb-1">导出与汇报</h1>
          <p className="text-sm text-ink-secondary">
            预览一页式汇报图，导出为 PDF 或复制链接分享。汇报包含设计参数表、可靠度统计与待复核清单。
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

          {/* Scenario comparison hint */}
          <div className="card p-4">
            <h2 className="label-xs mb-2">其他方案对比</h2>
            <p className="text-xs text-ink-tertiary mb-3 leading-relaxed">
              当前汇报采用方案 {facadeCase.overview.selectedScenarioId}。
              可前往推理页切换方案后重新导出。
            </p>
            <Link
              href={`/${projectId}/reasoning`}
              className="text-xs text-accent hover:underline"
            >
              → 前往推理页切换方案
            </Link>
          </div>

          {/* Steps recap */}
          <div className="card p-4">
            <h2 className="label-xs mb-3">推理流程完成情况</h2>
            <div className="space-y-2">
              {[
                { label: '证据提取', count: `${facadeCase.evidence.length} 条`, done: true },
                { label: '参数映射', count: `${facadeCase.parameterMappings.length} 个`, done: true },
                { label: '推理补全', count: `方案 A/B/C`, done: true },
                { label: '结果总览', count: `可靠度 ${formatReliability(facadeCase.overview.overallReliability)}`, done: true },
              ].map((step) => (
                <div key={step.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-observe-subtle border border-observe-muted flex items-center justify-center">
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4L3.5 6L6.5 2" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-ink-primary">{step.label}</span>
                  </div>
                  <span className="text-ink-tertiary">{step.count}</span>
                </div>
              ))}
            </div>
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
